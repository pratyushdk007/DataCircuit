import{
    calculateIqrProfile
}from "./statistics.js"

export function detectAmountAnomaly(amountPaise,historicalAmounts){
    const validAmounts =historicalAmounts.filter(Number.isSafeInteger)

    if(validAmounts.length<30){
        return{
            isAnomly:false,
            reason:"INSUFFICENT_BASELINE"
        }
    }

    const profile=calculateIqrProfile(validAmounts);

    if(profile.iqr===0){
        return{
            isAnomly:false,
            reason:"INSUFFICIENT_VARIATION"
        }
    }

    const isOutliner=amountPaise<profile.lowerBound||amountPaise>profile.upperBound;

    if(!isOutliner){
        return{
            isAnomly:false,
            reason: "WITHIN_EXPECTED_RANGE"
        }
    }

    return{
        isAnomaly:true,

    code: "AMOUNT_OUTLIER_IQR",

    message:
      `Amount ${amountPaise} is outside the historical IQR bounds`,

    observedValue: amountPaise,
    lowerBound: profile.lowerBound,
    upperBound: profile.upperBound
    }
}