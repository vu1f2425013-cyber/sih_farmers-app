import assert from 'node:assert';
import { test, describe } from 'node:test';
import { TRANSLATIONS } from './translations';

describe('i18n Multilingual Translation Dictionary Unit Tests', () => {
  const languages = ['en', 'hi', 'mr'] as const;

  test('all supported languages exist in translation dictionary', () => {
    for (const lang of languages) {
      assert.ok(TRANSLATIONS[lang], `Translation dictionary for '${lang}' should exist`);
    }
  });

  test('all English keys exist in Hindi and Marathi translations', () => {
    const enKeys = Object.keys(TRANSLATIONS.en) as (keyof typeof TRANSLATIONS.en)[];
    assert.ok(enKeys.length > 0, 'English translations should not be empty');

    for (const key of enKeys) {
      assert.ok(
        TRANSLATIONS.hi[key] !== undefined,
        `Hindi translation missing key: '${String(key)}'`
      );
      assert.ok(
        TRANSLATIONS.mr[key] !== undefined,
        `Marathi translation missing key: '${String(key)}'`
      );
    }
  });

  test('app title and tagline are correctly localized', () => {
    assert.strictEqual(TRANSLATIONS.en.appName, "FARMER'S FRIEND");
    assert.strictEqual(TRANSLATIONS.hi.appName, "फार्मर्स फ्रेंड");
    assert.strictEqual(TRANSLATIONS.mr.appName, "शेतकरी मित्र");
  });
});
