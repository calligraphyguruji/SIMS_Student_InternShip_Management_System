import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);
const RouteContext = createContext({ params: {}, outlet: null });

const normalizePath = (path) => {
  if (!path) return "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, "") : normalized;
};

const joinPaths = (base, path) => {
  if (!path) return normalizePath(base);
  if (path.startsWith("/")) return normalizePath(path);
  return normalizePath(`${base === "/" ? "" : base}/${path}`);
};

const getCurrentPath = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;

export const BrowserRouter = ({ children }) => {
  const [location, setLocation] = useState(getCurrentPath);

  useEffect(() => {
    const handlePop = () => setLocation(getCurrentPath());
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = useCallback((to, options = {}) => {
    const next = typeof to === "number" ? to : String(to || "/");
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }

    const target = next.startsWith("/") ? next : joinPaths(window.location.pathname, next);
    if (options.replace) window.history.replaceState(null, "", target);
    else window.history.pushState(null, "", target);
    setLocation(getCurrentPath());
    window.scrollTo({ top: 0 });
  }, []);

  const value = useMemo(
    () => ({ location: { pathname: window.location.pathname }, navigate }),
    [location]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export const useNavigate = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useNavigate must be used inside BrowserRouter");
  return context.navigate;
};

export const useParams = () => useContext(RouteContext).params;

export const Link = ({ to, replace = false, onClick, children, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export const NavLink = ({ to, className, children, end = false, ...props }) => {
  const { location } = useContext(RouterContext);
  const target = normalizePath(to);
  const current = normalizePath(location.pathname);
  const isActive = end ? current === target : current === target || current.startsWith(`${target}/`);
  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link to={to} className={resolvedClassName} {...props}>
      {typeof children === "function" ? children({ isActive }) : children}
    </Link>
  );
};

export const Navigate = ({ to, replace = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
};

export const Outlet = () => useContext(RouteContext).outlet;

export const Route = () => null;

const flattenRoutes = (children, basePath = "/", parents = []) => {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) return [];

    const routePath = child.props.path ? joinPaths(basePath, child.props.path) : basePath;
    const routeParents = [...parents, child.props.element].filter(Boolean);
    const childRoutes = child.props.children
      ? flattenRoutes(child.props.children, routePath, routeParents)
      : [];

    if (childRoutes.length) return childRoutes;
    return [{ path: child.props.path === "*" ? "*" : routePath, elements: routeParents }];
  });
};

const matchRoute = (routePath, pathname) => {
  if (routePath === "*") return { params: {} };

  const routeParts = normalizePath(routePath).split("/").filter(Boolean);
  const pathParts = normalizePath(pathname).split("/").filter(Boolean);

  if (routeParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < routeParts.length; i += 1) {
    const routePart = routeParts[i];
    const pathPart = pathParts[i];
    if (routePart.startsWith(":")) params[routePart.slice(1)] = decodeURIComponent(pathPart);
    else if (routePart !== pathPart) return null;
  }

  return { params };
};

export const Routes = ({ children }) => {
  const { location } = useContext(RouterContext);
  const routes = flattenRoutes(children);
  const route = routes.find((candidate) => matchRoute(candidate.path, location.pathname)) || routes.at(-1);
  const match = matchRoute(route.path, location.pathname) || { params: {} };

  return route.elements.reduceRight(
    (outlet, element) => (
      <RouteContext.Provider value={{ params: match.params, outlet }}>{element}</RouteContext.Provider>
    ),
    null
  );
};
