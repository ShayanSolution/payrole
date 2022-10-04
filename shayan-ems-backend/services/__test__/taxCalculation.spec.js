import Utils from '../../utils/utils'

describe('Calculate tax', () => {
    test('when salary amount is not given', () => {
        expect(Utils.calculateTax()).toEqual(0)
    })
    test('When added we add string instead of number', () => {
        expect(Utils.calculateTax('100000')).toEqual(1250)
    })
    test('When added we add string instead of number', () => {
        expect(Utils.calculateTax('lol')).toEqual(0)
    })

    test('When added we add zero salary ', () => {
        expect(Utils.calculateTax(0)).toEqual(0)
    })

    test('when salary is between 0 to 50 thousand', () => {
        expect(Utils.calculateTax(25000)).toEqual(0)
    })
    test('When salary is equal 6lac annually', () => {
        expect(Utils.calculateTax(50000)).toEqual(0)
    })
    test('When salary is between 6lac to 12lac annually', () => {
        expect(Utils.calculateTax(55000)).toEqual(125)
    })

    test('When salary is equal to 12lac annually', () => {
        expect(Utils.calculateTax(100000)).toEqual(1250)
    })
    test('When salary is between 12lac to 24lac annually', () => {
        expect(Utils.calculateTax(150000)).toEqual(7500)
    })

    test('When salary is equal to 24lac annually', () => {
        expect(Utils.calculateTax(200000)).toEqual(13750)
    })
    test('When salary is between 24lac to 36lac annually', () => {
        expect(Utils.calculateTax(250000)).toEqual(23750)
    })
    test('When salary is equal to 36lac annually', () => {
        expect(Utils.calculateTax(300000)).toEqual(33750)
    })
    test('When salary is between 36lac to 60lac annually', () => {
        expect(Utils.calculateTax(350000)).toEqual(46250)
    })
    test('When salary is equal to 60lac annually', () => {
        expect(Utils.calculateTax(500000)).toEqual(83750)
    })
    test('When salary is between 60lac and 120lac annually', () => {
        expect(Utils.calculateTax(700000)).toEqual(148750)
    })
    test('When salary is equal to 120lac annually', () => {
        expect(Utils.calculateTax(1000000)).toEqual(246250)
    })
    test('When salary is greater 120lac annually', () => {
        expect(Utils.calculateTax(1200000)).toEqual(316250)
    })
})
