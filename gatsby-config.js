const rawPathPrefix = (process.env.PATH_PREFIX || '').trim()
const pathPrefix = ['none', 'root', '.'].includes(rawPathPrefix.toLowerCase()) ? '' : rawPathPrefix

module.exports = {
  pathPrefix,
  siteMetadata: {
    title: 'Mikhail Trifonov',
    description: 'Java backend developer | aka Luminais',
    siteUrl: 'https://luminais.tech',
  },
  plugins: [],
}
