import { useMemo } from 'react';
import type { Measurements, IdealMeasurements, ComparisonMode, ProportionItem } from '../types';
import {
    calcularIdeaisGoldenRatio,
    calcularIdeaisClassicPhysique,
    calcularIdeaisMensPhysique
} from '@/services/calculations';
import { getProportionItems } from '../config/proportionItems';

/**
 * Hook for calculating proportions based on user measurements and comparison mode
 */
export const useProportionCalculations = (
    userMeasurements: Measurements,
    comparisonMode: ComparisonMode
) => {
    // Calculate ideal measurements based on selected mode
    const ideais = useMemo<IdealMeasurements>(() => {
        switch (comparisonMode) {
            case 'golden':
                return calcularIdeaisGoldenRatio(userMeasurements);
            case 'classic':
                return calcularIdeaisClassicPhysique(userMeasurements);
            case 'mens':
                return calcularIdeaisMensPhysique(userMeasurements);
        }
    }, [comparisonMode, userMeasurements]);

    // Generate proportion items configuration
    const proportionItems = useMemo<ProportionItem[]>(() =>
        getProportionItems(userMeasurements, ideais, comparisonMode),
        [userMeasurements, ideais, comparisonMode]
    );

    return {
        ideais,
        proportionItems
    };
};
