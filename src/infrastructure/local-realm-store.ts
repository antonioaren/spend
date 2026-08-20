import { emptySnapshot, type SpendSnapshot } from './memory-ports';

export type RealmDocument = SpendSnapshot;

/**
 * Realm-shaped object store. Native builds can swap this JSON document
 * for a live Realm; tests and Expo web persist the same schema.
 */
export class LocalRealmStore {
  private document: RealmDocument;

  constructor(initial?: RealmDocument) {
    this.document = initial ?? emptySnapshot();
  }

  read(): RealmDocument {
    return structuredClone(this.document);
  }

  write(mutator: (doc: RealmDocument) => void): RealmDocument {
    const next = structuredClone(this.document);
    mutator(next);
    this.document = next;
    return structuredClone(this.document);
  }
}

export class FileBackedRealmStore extends LocalRealmStore {
  constructor(
    private readonly io: { read: () => string | null; write: (value: string) => void },
  ) {
    const raw = io.read();
    super(raw ? (JSON.parse(raw) as RealmDocument) : undefined);
  }

  override write(mutator: (doc: RealmDocument) => void): RealmDocument {
    const next = super.write(mutator);
    this.io.write(JSON.stringify(next));
    return next;
  }
}
