# Colors (using tput so it matches terminal theme)
u_col="\[$(tput setaf 39)\]"    # user color
h_col="\[$(tput setaf 81)\]"    # host/distro color
p_col="\[$(tput setaf 226)\]"   # path color
rst="\[$(tput sgr0)\]"


# hpm shims
export PATH="$HOME/.hpm/symlinks:$PATH"

if [ -x "$(command -v fastfetch)" ] && [ -z "$FASTFETCH_SHOWN" ]; then
    FASTFETCH_SHOWN=1 fastfetch
fi
