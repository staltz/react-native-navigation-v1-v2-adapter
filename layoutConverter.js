import {generateNavigator} from './navigatorBridge';
import * as optionsConverter from './optionsConverter';
export function convertSingleScreen(screen, drawer, components) {
  if (drawer) {
    return convertDrawer(convertSingleScreen(screen), convertComponent(drawer.left), convertComponent(drawer.right));
  }

  return convertComponentStack(screen, components);
}

export function convertBottomTabs(tabs, drawer) {
  if (drawer) {
    return convertDrawer(convertBottomTabs(tabs), convertComponent(drawer.left), convertComponent(drawer.right));
  }

  return {
    bottomTabs: {
      children: tabs.map((tab) => {
        return convertComponentStack(tab);
      })
    }
  };
}

export function convertComponent(oldComponent) {
  if (!oldComponent) {
    return undefined;
  }

  oldComponent = Object.assign(oldComponent, oldComponent.navigatorStyle);

  const guid = generateGuid();
  const component = {
    id: guid,
    name: oldComponent.screen,
    passProps: {
      navigator: generateNavigator(guid, oldComponent)
    },
    options: optionsConverter.convertStyle(oldComponent)
  };

  return {component};
}


export function convertComponentStack(oldComponent, components) {
  const componentsArray = [];
  if (components) {
    components.forEach((component) => {
      componentsArray.push(convertComponent(component));
    });
  } else {
    componentsArray.push(convertComponent(oldComponent));
  }

  return {
    stack: {
      children: componentsArray
    }
  };
}

function convertDrawer(center, left, right) {
  return {
    sideMenu: {
      center,
      left,
      right
    }
  };
}

function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4();
}