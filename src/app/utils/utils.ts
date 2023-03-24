export default class Utils {
  static checkIsmobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    }
    else {
      return false;
    }
  }
}
