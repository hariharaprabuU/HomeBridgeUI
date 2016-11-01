class HomeController {
  constructor(pluginsService) {
    this.name = 'home';

    this.service = pluginsService;

    this.installed = {};
    this.outdated = {};
    this.outdatedLoaded = false;

    this.getInstalledPlugins();
    this.getOutdatedPlugins();
  }

  getInstalledPlugins(){
    this.service.getInstalledPlugins().then((res) => {
      this.installed = res.data;
    });
  }

  getOutdatedPlugins(){
    this.service.getOutdatedPlugins().then((res) => {
      console.log(res.data);
      this.outdated = res.data;
      this.outdatedLoaded = true;
    });
  }
}

export default HomeController;