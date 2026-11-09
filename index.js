import { ContentSecurityPolicy } from '@remix-run/headers'

// A typical strict document policy, rebuilt on every request because the nonce changes.
let nonce = 'NONCE_nonce_NONCE_1234'
let init = {
	defaultSrc: ["'none'"],
	baseUri: ["'none'"],
	connectSrc: ["'self'", 'https://events.example'],
	fontSrc: ["'self'"],
	formAction: ["'self'"],
	frameAncestors: ["'none'"],
	frameSrc: ["'none'"],
	imgSrc: ["'self'"],
	manifestSrc: ["'self'"],
	mediaSrc: ["'self'"],
	objectSrc: ["'none'"],
	scriptSrc: [`'nonce-${nonce}'`, "'strict-dynamic'"],
	scriptSrcAttr: ["'none'"],
	styleSrc: ["'self'", `'nonce-${nonce}'`],
	styleSrcAttr: ["'none'"],
	workerSrc: ["'self'"],
	upgradeInsecureRequests: true,
}

function measure(fn) {
	for (let i = 0; i < 20_000; i++) fn()
	let iterations = 200_000
	let start = performance.now()
	for (let i = 0; i < iterations; i++) fn()
	return ((performance.now() - start) * 1000) / iterations
}

// The same camelCase-to-hyphen conversion the constructor applies to every initializer key.
let keys = Object.keys(init)
let total = measure(() => new ContentSecurityPolicy(init).toString())
let conversion = measure(() => {
	for (let key of keys) key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
})

console.log(`new ContentSecurityPolicy(init).toString(): ${total.toFixed(2)} µs`)
console.log(`key conversion alone (${keys.length} keys):         ${conversion.toFixed(2)} µs (${Math.round((conversion / total) * 100)}% of the build)`)
