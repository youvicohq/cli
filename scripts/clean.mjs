#!/usr/bin/env node
import { rmSync } from "node:fs";

for (const path of ["dist", "coverage"]) {
    rmSync(path, { force: true, recursive: true });
}
