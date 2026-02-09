import { useMemo } from 'react';
import type { Measurements, IdealMeasurements, ComparisonMode, ProportionItem } from '../types';
import {
    calcularIdeaisGoldenRatio,
    calcularIdeaisClassicPhysique,
    calcularIdeaisMensPhysique,
    calcularIdeaisOpenBodybuilding,
    calcularIdeaisFemaleGoldenRatio,
    calcularIdeaisBikini,
    calcularIdeaisWellness,
    calcularIdeaisFigure,
    calcularIdeaisWomensPhysique,
    calcularIdeaisWomensBodybuilding
} from '@/services/calculations';
import { getProportionItems } from '../config/proportionItems';
import { getFemaleProportionItems } from '../config/femaleProportionItems';

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
            // Male Modes
            case 'golden':
                return calcularIdeaisGoldenRatio(userMeasurements);
            case 'classic':
                return calcularIdeaisClassicPhysique(userMeasurements);
            case 'mens':
                return calcularIdeaisMensPhysique(userMeasurements);
            case 'open':
                return calcularIdeaisOpenBodybuilding(userMeasurements);

            // Female Modes
            case 'female_golden':
                return calcularIdeaisFemaleGoldenRatio(userMeasurements);
            case 'bikini':
                return calcularIdeaisBikini(userMeasurements);
            case 'wellness':
                return calcularIdeaisWellness(userMeasurements);
            case 'figure':
                return calcularIdeaisFigure(userMeasurements);
            case 'womens_physique':
                return calcularIdeaisWomensPhysique(userMeasurements);
            case 'womens_bodybuilding':
                return calcularIdeaisWomensBodybuilding(userMeasurements);

            default:
                return calcularIdeaisGoldenRatio(userMeasurements);
        }
    }, [comparisonMode, userMeasurements]);


    // Generate proportion items configuration
    const proportionItems = useMemo<ProportionItem[]>(() => {
        const isFemaleMode = [
            'female_golden',
            'bikini',
            'wellness',
            'figure',
            'womens_physique',
            'womens_bodybuilding'
        ].includes(comparisonMode);

        if (isFemaleMode) {
            return getFemaleProportionItems(userMeasurements, ideais, comparisonMode);
        }

        return getProportionItems(userMeasurements, ideais, comparisonMode);
    }, [userMeasurements, ideais, comparisonMode]);

    return {
        ideais,
        proportionItems
    };
};
