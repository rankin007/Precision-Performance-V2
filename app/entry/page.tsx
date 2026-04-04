import MobileShell from '@/components/MobileShell'
import BioDataStepper from '@/components/BioDataStepper'

export default function MobileEntry() {
  return (
    <MobileShell title="Clinical Entry">
      <div className="w-full max-w-md mx-auto pt-8">
        <BioDataStepper />
      </div>
    </MobileShell>
  )
}
