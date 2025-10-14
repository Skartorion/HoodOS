# HoodOS live-iso branch

preferable qemu options:
`
qemu-system-x86_64 -enable-kvm -m 2G \
	-drive if=pflash,format=raw,readonly=on,file=/usr/share/edk2-ovmf/x64/OVMF_CODE.4m.fd \ // may vary
	-drive if=pflash,format=raw,file=/usr/share/edk2-ovmf/x64/OVMF_VARS.4m.fd \
    -cdrom <path-to-iso>
`
