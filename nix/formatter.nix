{ pkgs }:

pkgs.writeShellApplication {
  name = "website-format";

  runtimeInputs = [ pkgs.prettier ];

  text = ''
    exec prettier --write .
  '';
}
