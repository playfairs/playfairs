{
  description = "playfairs.cc - Next.js portfolio website";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            nodejs
            openssl
            pkg-config
            yarn
          ];

          shellHook = ''
            echo "Node.js version: $(node --version)"
            echo "Bun version: $(bun --version)"
          '';
        };
      in
      {
        devShells.default = devShell;
        
        packages.default = pkgs.stdenv.mkDerivation {
          pname = "playfairs-cc";
          version = "0.1.0";
          
          src = ./.;
          
          buildInputs = with pkgs; [ bun nodejs ];
          
          buildPhase = ''
            bun install
            bun run build
          '';
          
          installPhase = ''
            mkdir -p $out
            cp -r .next $out/
            cp -r public $out/ 2>/dev/null || true
            cp package.json $out/ 2>/dev/null || true
          '';
        };
      });
}
