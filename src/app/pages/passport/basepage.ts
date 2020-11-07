import { MenuController } from '@ionic/angular';

export class BasePage {

    constructor(public menuController: MenuController) {

    }
    ionViewWillEnter() {
        this.menuController.enable(false);
    }

    ionViewDidLeave() {
        this.menuController.enable(true);
    }
}
