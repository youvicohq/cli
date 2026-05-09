import { describe, expect, test } from "vitest";

import { writeResult } from "../src/lib/output.js";

describe("writeResult", () => {
    test("renders JSON", () => {
        const output: string[] = [];

        writeResult({
            data: [{
                id: "9e17540e-1314-4fa8-a00f-e0a66c2b7f75",
                name: "fdfdd"
            }]
        }, {
            stdout: message => output.push(message)
        });

        expect(output).toEqual([
            JSON.stringify({
                data: [{
                    id: "9e17540e-1314-4fa8-a00f-e0a66c2b7f75",
                    name: "fdfdd"
                }]
            }, null, 2)
        ]);
    });
});
