{
  lib,
  stdenv,
  rustPlatform,
  pkg-config,
  cargo-tauri,
  bun,
  nodejs,
  cargo,
  rustc,
  jq,
  wrapGAppsHook4,
  makeWrapper,
  dbus,
  glib,
  gtk4,
  libsoup_3,
  librsvg,
  libappindicator,
  glib-networking,
  openssl,
  webkitgtk_4_1,
  gst_all_1,
  neocode,
}:
rustPlatform.buildRustPackage (finalAttrs: {
  pname = "neocode-desktop";
  inherit (neocode)
    version
    src
    node_modules
    patches
    ;

  cargoRoot = "apps/desktop/src-tauri";
  cargoLock.lockFile = ../../apps/desktop/src-tauri/Cargo.lock;
  buildAndTestSubdir = finalAttrs.cargoRoot;

  nativeBuildInputs = [
    pkg-config
    cargo-tauri.hook
    bun
    nodejs # for patchShebangs node_modules
    cargo
    rustc
    jq
    makeWrapper
  ] ++ lib.optionals stdenv.hostPlatform.isLinux [ wrapGAppsHook4 ];

  buildInputs = lib.optionals stdenv.isLinux [
    dbus
    glib
    gtk4
    libsoup_3
    librsvg
    libappindicator
    glib-networking
    openssl
    webkitgtk_4_1
    gst_all_1.gstreamer
    gst_all_1.gst-plugins-base
    gst_all_1.gst-plugins-good
    gst_all_1.gst-plugins-bad
  ];

  strictDeps = true;

  preBuild = ''
    cp -a ${finalAttrs.node_modules}/{node_modules,apps,services,packages,platform,tooling,extensions,docs} .
    chmod -R u+w node_modules apps services packages platform tooling extensions docs
    patchShebangs node_modules
    patchShebangs apps/desktop/node_modules

    mkdir -p apps/desktop/src-tauri/sidecars
    cp ${neocode}/bin/neocode apps/desktop/src-tauri/sidecars/neocode-cli-${stdenv.hostPlatform.rust.rustcTarget}
  '';

  # see publish-tauri job in .github/workflows/publish.yml
  tauriBuildFlags = [
    "--config"
    "tauri.prod.conf.json"
    "--no-sign" # no code signing or auto updates
  ];

  # FIXME: workaround for concerns about case insensitive filesystems
  # should be removed once binary is renamed or decided otherwise
  # darwin output is a .app bundle so no conflict
  postFixup = lib.optionalString stdenv.hostPlatform.isLinux ''
    mv $out/bin/NeoCode $out/bin/neocode-desktop
    sed -i 's|^Exec=NeoCode$|Exec=neocode-desktop|' $out/share/applications/NeoCode.desktop
  '';

  meta = {
    description = "NeoCode Desktop App";
    homepage = "https://neo.khulnasoft.com";
    license = lib.licenses.mit;
    mainProgram = "neocode-desktop";
    inherit (neocode.meta) platforms;
  };
})
