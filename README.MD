Here’s a GitHub‑style, fully cleaned‑up README.md using the syntax and patterns from the GitHub docs you linked.​
HoodOS GNU/Linux

HoodOS is a fine‑tuned Debian‑based distribution focused on stability, security, and a user‑friendly GNOME desktop with carefully curated defaults.​
Highlights

    Opinionated GNOME setup with custom theming and extensions.​

    Encrypted‑by‑default installs (LUKS + ext4).​

    Calamares graphical installer with a simple “erase disk and install” flow.​

    “Userland Panic Button” to quickly kill remote access and lock the session.​

    Optional container‑aware package management via hpm and Podman.​

    [!NOTE]
    HoodOS is experimental and under active development. Expect rough edges and breaking changes between minor versions.

Project status

Current release:​

    Name: Hood GNU/Linux Ripple

    Version: 0.3

    Base: Debian (testing/stable mix via live‑build config)

    Desktop: GNOME

Issues and pull requests are welcome.
Getting the image
Build from source

Requirements on a Debian‑based host:​

bash
sudo apt install live-build debootstrap dpkg-dev

Clone the repository:

bash
git clone https://github.com/Skartorion/HoodOS
cd HoodOS
# For older machines using legacy boot:
# git clone --single-branch --branch hoodos-syslinux https://github.com/Skartorion/HoodOS
# cd HoodOS

Build the ISO:

bash
sudo lb build

    [!IMPORTANT]
    The build stage usually takes around ten minutes, but this varies heavily with CPU, disk, and network speed.​

The resulting ISO appears in the repository root (*.iso).​
Run in QEMU

Example QEMU invocation (UEFI, 2 GiB RAM):​

bash
qemu-system-x86_64 -enable-kvm -m 2G \
  -drive if=pflash,format=raw,readonly=on,file=/usr/share/edk2-ovmf/x64/OVMF_CODE.4m.fd \
  -drive if=pflash,format=raw,file=/usr/share/edk2-ovmf/x64/OVMF_VARS.4m.fd \
  -cdrom <path-to-hoodos.iso>

Paths to OVMF firmware may differ by distribution.
Verifying the ISO

Before booting, verify the checksum:​

bash
sha256sum -b <path-to-your-iso>

Expected SHA‑256:

text
C216696b0bf681d25c926b2ab500abfbe39df879167705c189a610e795b66f8a5

    [!CAUTION]
    Do not use the ISO if your checksum does not match.

Creating a bootable USB

You can use any ISO‑to‑USB tool. On Windows, Rufus is recommended.​

    Download Rufus from https://rufus.ie/en/.

    Select your USB drive.

    Choose the HoodOS ISO as the boot selection.

    Start the write process and wait until it completes.

On Linux, tools like dd, GNOME Disks, or Ventoy also work.
Installation overview

HoodOS uses Calamares as its graphical installer.​
What the installer does

    Erases the selected disk and installs HoodOS with full‑disk LUKS encryption and ext4.​

    Uses a simple guided flow: welcome → locale → keyboard → partition → users → summary → install → finished.​

    Installs GRUB‑EFI as the bootloader and regenerates grub.cfg with HoodOS branding and encrypted root.​

Configured requirements (from Calamares):​

    Storage: at least 20 GiB.

    RAM: at least 6 GiB recommended.

At the end of installation you are offered an immediate reboot.​
Desktop experience

Out of the box, HoodOS provides:​

    GNOME desktop with a dark‑leaning Everforest‑style shell theme and Papirus‑derived icon theme.

    Dconf defaults for backgrounds, file manager, and file chooser (hidden files shown, list view default, tuned search options).

    Custom Fastfetch configuration with a HoodOS logo and tailored system info groups.

Userland Panic Button

The “Userland Panic Button” is a GNOME Shell extension (upb@skartorion) backed by PolicyKit rules and systemd units.​

When you toggle it:

    Remote access services like SSH, RDP, VNC, and Nx are stopped via a dedicated kill_remote_access service.​

    NetworkManager’s global networking state can be disabled for users in the panic group.​

    Local sessions can be locked using org.freedesktop.login1.lock-sessions.​

The live user is added to a panic group so this control is available out of the box.​

    [!WARNING]
    The panic button is designed as a “kill switch” for remote access. It will intentionally disrupt active sessions and network connectivity.

hpm: container‑aware package installs

HoodOS ships hpm, an advanced wrapper around apt.​
Design

    Normal Debian‑origin packages are installed on the host via apt.​

    Packages from specific third‑party repos (e.g., Kali/Parrot/BlackArch) can be installed into Podman containers instead of directly on the host.​

    For containerized packages, hpm creates small wrapper scripts in /usr/local/bin that transparently podman exec into the right container and run the binary there.​

Container images and tarballs

HoodOS can preload Podman images from tarballs:​

    Expected location: ~/.hpm/images/*.tar.

    On first boot, a live‑config hook sets CONTAINERS_STORAGE_ROOT="$HOME/.hpm/containers" and loads any missing images via podman load -i.​​

    Because multi‑GiB images are not shipped in the repo, builders can pull appropriate images, podman save them, and drop the tarballs into ~/.hpm/images before building the ISO.​​

    [!TIP]
    Use hpm for “aggressive” tooling you’d rather sandbox, and stick to plain apt for normal system packages.

Plymouth & GRUB theming

HoodOS customizes both boot splash and GRUB.
​

    Plymouth themes (e.g., homeworld, Manjaro‑derived variants) live under /usr/share/plymouth/themes/.

    The active theme is selected in plymouthd.defaults and baked into the initramfs during the build or via plymouth-set-default-theme -R.
    ​

    GRUB theming is handled by shipping a theme under /boot/grub/themes/… and setting GRUB_THEME in /etc/default/grub, which Calamares’ grubcfg module respects when generating grub.cfg.
    ​

If you build your own theme, follow the upstream GRUB and Plymouth docs for directory layout and configuration keys.
Build internals (for contributors)

HoodOS uses live‑build plus Calamares.​

Key pieces:

    auto/config defines Debian release, image type, bootloader, firmware inclusion, and checksum generation.​

    config/includes.chroot* injects:

        GNOME defaults, themes, and extensions.

        Calamares settings and branding.

        Plymouth themes and defaults.

        Systemd units, policy rules, panic button scripts, and hpm hooks.​

    config/package-lists/ controls main package sets (desktop, tools, containers, etc.).​

    lib/live/config/ scripts perform first‑boot initialization (e.g., apt/hpm wiring, container image loading, shell selection).​

    [!NOTE]
    If you already know Debian Live, you can treat this repository as a specialized configuration overlay plus theming and installer glue.

Contributing & support

This project is early‑stage; expect rough edges.

    Issues & feature requests: https://github.com/Skartorion/HoodOS/issues​

    For installer problems, please attach logs from /var/log/calamares/ if possible.​

Ideas that are especially welcome:

    Improvements to Calamares flows and error handling.

    Better patterns for containerized tooling via hpm.

    Theme and UX refinements that keep the system clean and maintainable.
