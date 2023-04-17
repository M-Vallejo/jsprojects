'use strict'

/*

AFP: 2.87, max: RD$8,954.40
SFS: 3.04, max: RD$4,742.40
TSS: 5.91 (AFP + SFS)
ISR:
    ​Rentas hasta RD$416,220.00                                 Exento                                                                  |    0          -> 36,863.642
    ​Rentas desde RD$416,220.01 hasta RD$624,329.00             ​15% del excedente de RD$416,220.01                                     |    36,863.643 -> 58,751.284
    ​Rentas desde RD$624,329.01 hasta RD$867,123.00             ​RD$31,216.00 más el 20% del excedente de RD$624,329.01                 |    58,751.285 -> 86,219.842
    ​Rentas desde  RD$867,123.01 en adelante                    ​RD$79,776.00 más el 25% del excedente de RD$867,123.01                 |    86,219.843 -> ∞

*/

const AFP = {
  percent: 2.87,
  max: 8954.40
};

const SFS = {
  percent: 3.04,
  max: 4742.40
};

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

const formatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const formatCurrency = amount => formatter.format(amount);

const getAFP = amount => {
    const result = amount * AFP.percent/100;
    return result > AFP.max ? AFP.max : result;;
}

const getSFS = amount => {
    let result = amount * SFS.percent/100;
    return result > SFS.max ? SFS.max : result;
}

const getISR = amount => {
    const yearlyIncome = amount * 12;

    const isrToCompare = ISR.find(x=> (yearlyIncome <= x.max && yearlyIncome >= x.min) 
                                        || (yearlyIncome >= x.min && !x.max) 
                                        || (yearlyIncome <= x.min && !x.min));

    const result = (((yearlyIncome - isrToCompare.min) * isrToCompare.percent/100) + isrToCompare.fixed) / 12;

    return result;
}

const calcNetIncome = (amount, printDetail) => {
    const afp = getAFP(amount);
    const sfs = getSFS(amount);
    const tss = afp + sfs;
    const amountWithDiscount = amount - tss;
    const isr = getISR(amountWithDiscount);
    const totalDiscount = tss + isr;
    const netIncome = amount - totalDiscount;

    if(printDetail) {
        console.log("AFP: " + formatCurrency(afp));
        console.log("SFS: " + formatCurrency(sfs));
        console.log("TSS: " + formatCurrency(tss));
        console.log("ISR: " + formatCurrency(isr));
        console.log("Descuento total: " + formatCurrency(totalDiscount));
        console.log("Salario neto: " + formatCurrency(netIncome));
        console.log("Salario neto quincenal: " + formatCurrency(netIncome/2));
    }
    return {
      afp,
      sfs,
      isr,
      totalDiscount,
      netIncome
    };
}
