#!/bin/bash
# divert apt to wrapper on first boot
dpkg-divert --divert /usr/bin/apt.real --rename /usr/bin/apt
cp /usr/bin/apt-wrapper /usr/bin/apt
chmod 755 /usr/bin/apt

