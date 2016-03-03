@isTest
private class MathUtilTest {
    static testMethod void testGetRandomDecimal () {
        Decimal rand = MathUtil.getRandomDecimal(0,100);
        System.assert(rand >= 0 && rand <= 100);
    }
}