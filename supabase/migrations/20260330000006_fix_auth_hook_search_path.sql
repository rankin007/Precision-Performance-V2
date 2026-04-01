-- Migration: Fix mutable search_path on custom_access_token_hook
-- Advisory : Function public.custom_access_token_hook has a role mutable search_path
-- Fix      : Recreate with SET search_path = public to pin schema resolution
-- NOTE     : This function is a Supabase Auth hook — it MUST remain SECURITY DEFINER
--            so it can read the roles table on behalf of the authenticating user.
--            The search_path pin is the correct mitigation in this context.

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    claims      JSONB;
    user_role   TEXT;
BEGIN
    -- Extract existing claims from the JWT event
    claims := event -> 'claims';

    -- Look up the user's application role from the profiles table
    SELECT role
    INTO   user_role
    FROM   public.profiles
    WHERE  id = (event ->> 'user_id')::UUID;

    -- Inject the role into the JWT claims
    IF user_role IS NOT NULL THEN
        claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    END IF;

    -- Return the mutated event
    RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Ensure the hook has EXECUTE granted to the supabase_auth_admin role
-- (required for Supabase Auth hooks to fire correctly)
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(JSONB)
    TO supabase_auth_admin;

-- Revoke execute from public (defence-in-depth)
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(JSONB)
    FROM PUBLIC;
