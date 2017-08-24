import { collection as baseCollection } from 'libx'

export function collection (opts) {
  return baseCollection({
    create: (data, opts) => opts.model(data, { stripUndefined: true, parse: true, ...opts }),
    update: (existing, data, opts) => existing.set(data, { stripUndefined: true, parse: true, ...opts }),
    ...opts
  })
}
