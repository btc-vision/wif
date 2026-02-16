import { describe, it, expect } from 'vitest';
import { hexToBytes, bytesToHex } from '@noble/hashes/utils.js';
import { encode, decode } from '../build/index.js';
import fixtures from './fixtures.json';

const { valid, invalid } = fixtures;

describe('wif', () => {
    describe('encode', () => {
        for (const f of valid) {
            it(`encodes ${f.WIF}`, () => {
                const privateKey = hexToBytes(f.privateKeyHex);
                const actual = encode({ version: f.version, privateKey, compressed: f.compressed });
                expect(actual).toBe(f.WIF);
            });
        }
    });

    describe('decode', () => {
        for (const f of valid) {
            it(`decodes ${f.WIF}`, () => {
                const actual = decode(f.WIF, f.version);
                expect(actual.version).toBe(f.version);
                expect(bytesToHex(actual.privateKey)).toBe(f.privateKeyHex);
                expect(actual.compressed).toBe(f.compressed);
            });
        }
    });

    describe('encode invalid', () => {
        for (const f of invalid.encode) {
            it(`throws "${f.exception}" for ${f.privateKeyHex}`, () => {
                expect(() => {
                    encode({
                        version: f.version,
                        privateKey: hexToBytes(f.privateKeyHex),
                        compressed: false,
                    });
                }).toThrow(new RegExp(f.exception));
            });
        }
    });

    describe('decode invalid', () => {
        for (const f of invalid.decode) {
            it(`throws "${f.exception}" for ${f.WIF}`, () => {
                expect(() => {
                    decode(f.WIF, f.version);
                }).toThrow(new RegExp(f.exception));
            });
        }
    });

    describe('roundtrip', () => {
        for (const f of valid) {
            it(`decode/encode roundtrip for ${f.WIF}`, () => {
                const actual = encode(decode(f.WIF, f.version));
                expect(actual).toBe(f.WIF);
            });
        }
    });
});
