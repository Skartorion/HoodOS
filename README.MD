
> [!WARN]
> ReadMe under construction!



# Hood GNU/Linux

Fine-tuned debian derirative Linux distribution focused on stability, security and user-friendly UI.

# Aquiring the image

## Building from source

1. Install all the tools needed
- `sudo apt install live-build debootstrap dpkg-dev`

2. Clone this repository
- `git clone https://github.com/Skartorion/HoodOS && cd HoodOS`

- Or, for older machines
- `git clone --single-branch --branch hoodos-syslinux https://github.com/Skartorion/HoodOS && cd HoodOS`

3. Build

> [!IMPORTANT]
> this stage will take around ten minutes, although build time varies heavily depending on hardware.
- `sudo lb build`

# Installation

## Post-download

Before booting the ISO, please verify the checksum to ensure the file is not corrupted using this line:

`
sha256sum -b <path to your iso file>
`

Compare the output with this string:

`
C216696b0bf681d25c926b2ab500abfbe39df879167705c189a610e795b66f8a5
`

## Making a bootable USB drive

> [!NOTE]
> You may use any software to burn the ISO image available to you.

### Via Rufus (recommended)

You may burn ISO image onto the usb drive via Free and Open Source application Rufus.

1. Get rufus [here](https://rufus.ie/en/).

2. Proceed to select downloaded ISO file as a boot selection inside the app.

3. Voila


preferable qemu options:
`
qemu-system-x86_64 -enable-kvm -m 2G \
	-drive if=pflash,format=raw,readonly=on,file=/usr/share/edk2-ovmf/x64/OVMF_CODE.4m.fd \ // may vary
	-drive if=pflash,format=raw,file=/usr/share/edk2-ovmf/x64/OVMF_VARS.4m.fd \
    -cdrom <path-to-iso>
