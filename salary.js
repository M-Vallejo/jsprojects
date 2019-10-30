'use strict'

/*

AFP: 2.87
SFS: 3.04
TSS: 5.91
ISR:
    ​Rentas hasta RD$416,220.00                                 Exento                                                                 |    36,863.642
    ​Rentas desde RD$416,220.01 hasta RD$624,329.00             ​15% del excedente de RD$416,220.01                                     |    36,863.643 -> 58,751.284
    ​Rentas desde RD$624,329.01 hasta RD$867,123.00             ​RD$31,216.00 más el 20% del excedente de RD$624,329.01                 |    58,751.285 -> 86,219.842
    ​Rentas desde  RD$867,123.01 en adelante                    ​RD$79,776.00 más el 25% del excedente de RD$867,123.01                 |    86,219.843

*/

const AFP = 2.87;
const SFS = 3.04;
const ISR = [
    {
        min: null,
        max: 416220.00,
        percent: 0,
        fixed: 0
    },
    {
        min: 416220.01,
        max: 624329.00,
        percent: 15,
        fixed: 0
    },
    {
        min: 624329.01,
        max: 867123.00,
        percent: 20,
        fixed: 31216.00
    },
    {
        min: 867123.01,
        max: null,
        percent: 25,
        fixed: 79776.00
    }
];

function getAFP(amount) {
    let result = amount * AFP/100;
    return result;
}

function getSFS(amount) {
    let result = amount * SFS/100;
    return result;
}

function getTSS(amount) {
    let afp = getAFP(amount);
    let sfs = getSFS(amount);
    let result = afp + sfs;

    return result;
}

function getISR(amount) {
    let yearIncome = amount * 12;

    let isrToCompare = ISR.filter(x=> (yearIncome <= x.max && yearIncome >= x.min) 
                                        || (yearIncome >= x.min && !x.max) 
                                        || (yearIncome <= x.min && !x.min));
    let compare = isrToCompare[0];
    let result = (((yearIncome - compare.min) * compare.percent/100) + compare.fixed) / 12;

    return result;
}

function CalcNetIncome(amount, printDetail) {
    let afp = getAFP(amount);
    let sfs = getSFS(amount);
    let tss = afp + sfs;
    let amountWithDiscount = amount - tss;
    let isr = getISR(amountWithDiscount);

    let totalDiscount = tss + isr;
    let netIncome = amount - totalDiscount;

    if(printDetail) {
        console.log("AFP: " + afp);
        console.log("SFS: " + sfs);
        console.log("TSS: " + tss);
        console.log("ISR: " + isr);
        console.log("Descuento total: " + totalDiscount);
        console.log("Salario neto: " + netIncome);
        console.log("Salario neto quincenal: " + netIncome/2);
    }
    return netIncome;
}
