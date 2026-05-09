type Writer = (message: string) => void;

type OutputOptions = {
    stdout: Writer;
};

export function writeJson(value: unknown, stdout: Writer) {
    stdout(JSON.stringify(value, null, 2));
}

export function writeResult(value: unknown, options: OutputOptions) {
    writeJson(value, options.stdout);
}
