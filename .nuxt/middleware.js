const middleware = {}

middleware['authenticated'] = require('../middleware/authenticated.ts')
middleware['authenticated'] = middleware['authenticated'].default || middleware['authenticated']

export default middleware
