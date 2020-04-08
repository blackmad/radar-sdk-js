import  Http from '../http';
import Navigator from '../navigator';

class Routing {
  static async getDistanceToDestination(routingOptions={}) {
    if (!routingOptions.origin) {
      const { latitude, longitude } = await Navigator.getCurrentPosition();
      routingOptions.origin = { latitude, longitude };
    }

    let {
      origin,
      destination,
      modes,
      units,
    } = routingOptions;

    if (origin) {
      origin = `${origin.latitude},${origin.longitude}`;
    }
    if (destination) {
      destination = `${destination.latitude},${destination.longitude}`;
    }
    if (modes) {
      modes = modes.join(',');
    }

    const params = {
      origin,
      destination,
      modes,
      units,
    };

    const response = await Http.request('GET', 'v1/route/distance', params);

    return response.routes;
  }
}

export default Routing;