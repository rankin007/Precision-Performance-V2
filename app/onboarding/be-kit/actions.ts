'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitBeKitApplication(formData: FormData) {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Extract Fields
    const fullName = formData.get('fullName') as string
    const businessName = formData.get('businessName') as string
    const shippingAddress = formData.get('shippingAddress') as string
    const mobile = formData.get('mobile') as string
    const email = formData.get('email') as string
    const website = formData.get('website') as string

    // 3. Server-side Validation (Website Protocol)
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
        return { error: 'Website must include http:// or https://' }
    }

    // 4. Database Insertion
    const { error } = await supabase
        .from('be_kit_applications')
        .insert({
            user_id: user?.id, // Link to user if logged in
            full_name: fullName,
            business_name: businessName,
            shipping_address: shippingAddress,
            mobile: mobile,
            email: email,
            website: website
        })

    if (error) {
        console.error('BE Kit Application Error:', error)
        return { error: `Submission failed: ${error.message}` }
    }

    // 5. Update Profile & Metadata (Elite Onboarding Completion)
    if (user) {
        await supabase
            .from('profiles')
            .update({ onboarding_completed: true })
            .eq('id', user.id)

        await supabase.auth.updateUser({
            data: { onboarding_completed: true }
        })
    }

    // 6. Notification Logic: Trigger 'New Applicant' email to Principal Orchestrator
    try {
        await resend.emails.send({
            from: 'BE Onboarding <onboarding@precisionperformance.com.au>',
            to: [process.env.PRINCIPAL_ORCHESTRATOR_EMAIL || 'admin@precisionperformance.com.au'],
            subject: 'New Professional BE Kit Application',
            html: `
                <h1>New Professional BE Kit Applicant</h1>
                <p><strong>User ID:</strong> ${user?.id || 'Anonymous'}</p>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Business:</strong> ${businessName}</p>
                <p><strong>Shipping:</strong> ${shippingAddress}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Website:</strong> ${website}</p>
                <hr />
                <p><em>Precision Performance V3 · Automated Handshake Notification</em></p>
            `
        })
    } catch (emailError) {
        console.error('Failed to send notification email:', emailError)
        // We continue anyway as the DB record is the source of truth
    }

    // 5. Success State
    return { success: true }
}
