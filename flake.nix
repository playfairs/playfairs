{
  description = "pfcc";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
      pkgsFor = system: import nixpkgs { inherit system; };
    in
    {
      formatter = forAllSystems (system: import ./nix/formatter.nix { pkgs = pkgsFor system; });

      packages = forAllSystems (system:
        let
          pkgs = pkgsFor system;
        in
        {
          default = import ./nix/formatter.nix { inherit pkgs; };
        });

      devShells = forAllSystems (system:
        let
          pkgs = pkgsFor system;
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs_22
              pkgs.prettier
            ];
            shellHook = ''
              export PATH="$PWD/node_modules/.bin:$PATH"
            '';
          };
        });
    };
}
