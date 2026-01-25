text
# HoodOS GNU/Linux

HoodOS is a fine‑tuned Debian‑based distribution focused on **stability**, **security**, and a user‑friendly GNOME desktop with carefully curated defaults.

Key features:

- Opinionated GNOME setup with custom theming and extensions
- Encrypted‑by‑default installs (LUKS, ext4)
- Calamares graphical installer with simple “erase disk” flow
- “Userland Panic Button” to quickly kill remote access and lock the session
- Optional container‑aware package management via `hpm` and Podman

---

## Project status

HoodOS is experimental and under active development. Expect breaking changes between minor versions and limited hardware coverage. Issues and merge requests are welcome.

Current release:

- Name: `Hood GNU/Linux Ripple`
- Version: `0.3`
- Base: Debian (testing/stable stack)
- Desktop: GNOME

---

## Getting the image

### Option 1: Build from source

Requirements (on a Debian‑based host):

```bash
sudo apt install live-build debootstrap dpkg-dev

Clone the repository:

bash
git clone https://github.com/Skartorion/HoodOS && cd HoodOS
# For older machines using legacy boot:
# git clone --single-branch --branch hoodos-syslinux https://github.com/Skartorion/HoodOS && cd HoodOS

Build the ISO:

bash
sudo lb build

    Note
    Build time is usually around 10 minutes, but depends heavily on your CPU, disk, and network.

The resulting ISO will be written to the repository root (see *.iso in the build directory).
Option 2: Run in QEMU

Example QEMU command (UEFI, 2 GiB RAM):

bash
qemu-system-x86_64 -enable-kvm -m 2G \
  -drive if=pflash,format=raw,readonly=on,file=/usr/share/edk2-ovmf/x64/OVMF_CODE.4m.fd \
  -drive if=pflash,format=raw,file=/usr/share/edk2-ovmf/x64/OVMF_VARS.4m.fd \
  -cdrom <path-to-hoodos.iso>

Paths to OVMF firmware may differ across distributions.
Verifying the ISO

Before booting, verify the checksum:

bash
sha256sum -b <path-to-your-iso>

Compare against:

text
C216696b0bf681d25c926b2ab500abfbe39df879167705c189a610e795b66f8a5

Only proceed if the checksums match.
Creating a bootable USB

You can use any ISO‑to‑USB tool you trust. On Windows, Rufus is recommended.

    Download Rufus from: https://rufus.ie/en/

    Select your USB drive and choose the HoodOS ISO as the boot selection.

    Start the write process and wait for it to complete.

On Linux, tools like dd, gnome-disks, or Ventoy also work.
Installation overview

HoodOS uses Calamares as the graphical installer.

Highlights:

    Default mode: erase disk and install HoodOS with full‑disk LUKS encryption and ext4.

    No manual partitioning in the shipped Calamares profile.

    GRUB‑EFI bootloader, themed and configured from within the live system.

    Post‑install reboot is offered automatically at the end of the installer.

System requirements (as configured in Calamares):

    Storage: ≥ 20 GiB

    RAM: ≥ 6 GiB recommended

Desktop experience

Out of the box, HoodOS ships:

    GNOME with customized theme and icons

    Dark‑leaning color scheme, tuned fonts, and file manager defaults

    Preconfigured GNOME extensions, including a “Userland Panic Button” in Quick Settings

The panic button:

    Belongs to a GNOME Shell extension (upb@skartorion)

    Uses PolicyKit rules and systemd to:

        Stop selected remote‑access services (SSH, RDP, VNC, etc.)

        Disable networking at the NetworkManager level

        Lock active sessions

This is meant as a “one‑shot kill switch” for remote access on shared or hostile networks.
hpm: container‑aware package installs

HoodOS includes hpm, a wrapper around apt designed for safer installs of “aggressive” or non‑Debian packages:

    Normal Debian packages are installed on the host via apt.

    Packages detected from Kali/Parrot/BlackArch repos can be installed inside Podman containers.

    For containerized packages, hpm generates small shim binaries under /usr/local/bin that transparently podman exec into the right container.

Container images:

    Live image can optionally ship .tar exports of Podman images under ~/.hpm/images.

    If those tarballs are not present, you can pull and save images yourself, then place the .tar files in that directory.

This feature is experimental and intended for advanced users who know what they’re installing.
Building notes (for contributors)

The live image is built with live‑build:

    Configuration lives under config/ and auto/.

    auto/config wires a Debian‑based iso‑hybrid image with GRUB‑EFI, firmware, and checksums.

    GNOME defaults, themes, Calamares configuration, and extra tools are injected via:

        config/includes.chroot*

        config/package-lists/

        config/hooks/ and lib/live/config scripts

If you are familiar with Debian Live, you can treat this repository as a specialized live‑build config plus theming and installer glue.
Contributing & support

This project is early‑stage; expect rough edges.

    Bug reports, ideas, and patches:

        GitHub Issues: https://github.com/Skartorion/HoodOS/issues
