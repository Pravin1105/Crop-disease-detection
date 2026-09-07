import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const RouterContext = createContext(null);
const ParamsContext = createContext({});

function readLocation() {
  return {
    pathname: window.location.pathname || "/",
    search: window.location.search,
    hash: window.location.hash
  };
}

function normalizePath(to) {
  if (!to) {
    return "/";
  }

  return to.startsWith("/") ? to : `/${to}`;
}

function trimTrailingSlash(path) {
  if (path === "/") {
    return path;
  }

  return path.replace(/\/+$/, "");
}

function matchPath(routePath, currentPath) {
  const routeSegments = trimTrailingSlash(routePath).split("/").filter(Boolean);
  const currentSegments = trimTrailingSlash(currentPath).split("/").filter(Boolean);

  if (routeSegments.length !== currentSegments.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < routeSegments.length; index += 1) {
    const routeSegment = routeSegments[index];
    const currentSegment = currentSegments[index];

    if (routeSegment.startsWith(":")) {
      params[routeSegment.slice(1)] = decodeURIComponent(currentSegment);
      continue;
    }

    if (routeSegment !== currentSegment) {
      return null;
    }
  }

  return { params };
}

function useRouter() {
  const router = useContext(RouterContext);

  if (!router) {
    throw new Error("Router components must be used inside BrowserRouter.");
  }

  return router;
}

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const handlePopState = () => setLocation(readLocation());

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useMemo(
    () => (to, options = {}) => {
      if (typeof to === "number") {
        window.history.go(to);
        return;
      }

      const nextPath = normalizePath(to);
      const historyMethod = options.replace ? "replaceState" : "pushState";

      window.history[historyMethod]({}, "", nextPath);
      setLocation(readLocation());
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    },
    []
  );

  const value = useMemo(
    () => ({ location, navigate }),
    [location, navigate]
  );

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
}

export function Routes({ children }) {
  const { location } = useRouter();
  const routes = React.Children.toArray(children);

  for (const route of routes) {
    if (!React.isValidElement(route)) {
      continue;
    }

    const match = matchPath(route.props.path, location.pathname);

    if (match) {
      return (
        <ParamsContext.Provider value={match.params}>
          {route.props.element}
        </ParamsContext.Provider>
      );
    }
  }

  return null;
}

export function Route() {
  return null;
}

export function useNavigate() {
  return useRouter().navigate;
}

export function useParams() {
  return useContext(ParamsContext);
}

export function NavLink({
  children,
  className,
  end = false,
  onClick,
  target,
  to,
  ...props
}) {
  const { location, navigate } = useRouter();
  const href = normalizePath(to);
  const activePath = trimTrailingSlash(href);
  const currentPath = trimTrailingSlash(location.pathname);
  const isActive = end
    ? currentPath === activePath
    : currentPath === activePath || currentPath.startsWith(`${activePath}/`);
  const resolvedClassName = typeof className === "function"
    ? className({ isActive })
    : className;

  function handleClick(event) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      target
    ) {
      return;
    }

    event.preventDefault();
    navigate(href);
  }

  return (
    <a
      {...props}
      aria-current={isActive ? "page" : undefined}
      className={resolvedClassName}
      href={href}
      onClick={handleClick}
      target={target}
    >
      {children}
    </a>
  );
}
