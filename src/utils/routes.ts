import { About, Home } from '../components/pages';

export type Route = {
  text: string;
  path: string;
  component: () => JSX.Element;
  protected: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  index?: boolean;
};

export const ROUTES: { [x: string]: Route } = {
  home: {
    path: '/',
    text: 'Home',
    component: Home,
    protected: false,
    index: true,
  },
  about: {
    text: 'Info',
    path: '/info',
    component: About,
    protected: false,
    index: false,
  }
};
