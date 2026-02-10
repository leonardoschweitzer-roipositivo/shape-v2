/**
 * PersonalCoachDashboard - Dashboard do Personal para acompanhar Daily Tracking dos atletas
 */

import React from 'react'
import { PersonalDashboard } from '../../organisms/PersonalDashboard'

interface PersonalCoachDashboardProps {
    onAtletaClick?: (atletaId: string) => void
}

export const PersonalCoachDashboard: React.FC<PersonalCoachDashboardProps> = ({ onAtletaClick }) => {
    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                <PersonalDashboard onAtletaClick={onAtletaClick} />
            </div>
        </div>
    )
}

export default PersonalCoachDashboard
