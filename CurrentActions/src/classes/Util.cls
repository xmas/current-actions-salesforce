public class Util {

    public static List <Object> push (List <Object> listt, Object item) {
        if (listt == null) {
            listt = new List <Object> ();
            listt.add(item);
        }
        else if (listt.size() == 0) {
            listt.add(item);
        } else {
            listt.add(0, item);
        }
        return listt;
    }
    
}