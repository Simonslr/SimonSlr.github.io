// EuroPrix — root composition
const { useEffect: useEffectApp, useState: useStateApp, useRef: useRefApp } = React;

const App = () => {
  const [variant, setVariant] = useStateApp(() => {
    try { return localStorage.getItem("europrix:hero") || "dark"; } catch (e) { return "dark"; }
  });
  const prevVariant = useRefApp(variant);
  const didMount = useRefApp(false);

  useEffectApp(() => {
    try { localStorage.setItem("europrix:hero", variant); } catch (e) {}
    if (!window.EuroPrixScroll) return;

    // First mount: initialize once.
    if (!didMount.current) {
      didMount.current = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.EuroPrixScroll.init());
      });
      return;
    }

    // Variant actually changed: tear down and re-init.
    if (prevVariant.current !== variant) {
      prevVariant.current = variant;
      window.EuroPrixScroll.kill();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.EuroPrixScroll.init());
      });
    }
  }, [variant]);

  return (
    <React.Fragment>
      <window.Navbar />
      <main>
        <window.Hero variant={variant} />
        <window.Method />
        <window.Featured />
        <window.Catalogue />
        <window.Trust />
        <window.CTAFinal />
      </main>
      <window.Footer />
      <window.VariantSwitch variant={variant} setVariant={setVariant} />
    </React.Fragment>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
