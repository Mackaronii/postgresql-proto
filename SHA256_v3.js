// BitString
// fields:
// 	values : An array of numbers that are either 0 or 1, representing a binary version of the charCodes for every character in the string it's representing
// 
// methods:
// 	toStrng : returns the string that the values represent
// 	reassign : reassigns the values to either represent a new string or be directly assigned to a new set of values. Throws an error if the new values aren't in binary.
// 	rightRotate : moves all bits right, except moves the rightmost bit to the leftmost position
// 	rightShift : moves all bits right, except removes the rightmost bit and inserts a zero in the leftmost position
// 	leftRotate : like rightRotate but in the other direction
// 	leftShift : like rightShift but in the other direction
// 	xor : xor each bit of this BitString with each bit of the BitString passed by parameters. Throws an  error if the  BitStrings are different lengths
// 	add : 
// 
// x
function BitString(str) { // basically stores a string as an array of bits
	var o = {values:[]};
	
	o.toHex = (function(self) {
		var outputString = "" , intermediateArray , intermediateString;
		for( let i = 0; i < self.values.length / 4; i++ ) {
			intermediateArray = self.values.slice( i * 4 , i * 4 + 4 );
			intermediateString = "";
			for( let j = 0; j < intermediateArray.length; j++ ) {
				intermediateString += intermediateArray[ j ];
			}
			outputString += parseInt( intermediateString , 2 ).toString(16);
		}
		return outputString
	}).bind(o, o);
	
	o.toBin = (function(self) {
		var outputString = "" , intermediateArray , intermediateString;
		for( let i = 0; i < self.values.length; i++ ) {
			intermediateArray = self.values.slice( i , i + 1 );
			intermediateString = "";
			for( let j = 0; j < intermediateArray.length; j++ ) {
				intermediateString += intermediateArray[ j ];
			}
			outputString += parseInt( intermediateString , 2 ).toString(2);
		}
		return outputString
	}).bind(o, o);
	
	o.reassign = (function(self, newVal) {
		if(newVal instanceof BitString) {
			self = newVal.clone();
		} else if(newVal instanceof Array) {
			self.values = [];
			for(let i = 0; i < newVal.length; i++){
				self.values[i] = (newVal[i] === 1)? 1 : 0 ; // Type is important in this check
			}
		}
		else if(typeof newVal === "string") {
			self.values = [];
			for(let i = 0; i < newVal.length; i++) { // get the charcode for each character, turn that directly into a string in base 2, split all the bits into an array, turn the string bits into numeric bits
				let thisChar = newVal.charCodeAt(i).toString(2).split("").map((x => parseInt(x, 2)));
				while(thisChar.length % 8 != 0) { // if the character isn't represented by a whole number of bytes, prepend it with zeroes until it is
					thisChar.unshift(0);
				}
				self.values = self.values.concat(thisChar);
			}
		} else if(typeof newVal == "number") {
			self.values = newVal.toString(2).split("").map((x => parseInt(x, 2)));
			while(self.values.length % 8 != 0) {
				self.values.unshift(0);
			}
		} else {
			self.values = [];
		}
		return self.values;
	}).bind(o, o);
	
	o.rightRotate = (function(self, places) {
		for(let i = 0; i < places; i++) {
			self.values.unshift(self.values.pop());
		}
		return self;
	}).bind(o, o);
	
	o.rightShift = (function(self, places) {
		for(let i = 0; i < places; i++) {
			self.values.unshift(0);
			self.values.pop();
		}
		return self;
	}).bind(o, o);
	
	o.leftRotate = (function(self, places) {
		for(let i = 0; i < places; i++) {
			self.values.push(self.values.shift());
		}
		return self;
	}).bind(o, o);
	
	o.leftShift = (function(self, places) {
		for(let i = 0; i < places; i++) {
			self.values.push(0);
			self.values.shift();
		}
		return self;
	}).bind(o, o);
	
	o.xor = (function(self, bitStr2) {
		if(self.values.length != bitStr2.values.length) throw "The two BitStrings "+ self +" and "+ bitStr2 +" were different lengths!";
		var output = new BitString("");
		
		for(let i = 0; i < self.values.length; i++) {
			output.values[i] = self.values[i] ^ bitStr2.values[i];
		}
		
		return output;
	}).bind(o, o);
	
	o.and = (function(self, bitStr2) {
		if(self.values.length != bitStr2.values.length) throw "The two BitStrings "+ self +" and "+ bitStr2 +" were different lengths!";
		var output = new BitString("");
		
		for(let i = 0; i < self.values.length; i++) {
			output.values[i] = self.values[i] & bitStr2.values[i];
		}
		
		return output;
	}).bind(o, o);
	
	o.not = (function(self) {
		var output = self.clone();
		output.values = output.values.map(x => (x == 1)? 0 : 1);
		return output;
	}).bind(o, o);
	
	o.add = (function(self, bitStr2) {
		var output = new BitString();
		var carry = 0;
		
		for(let i = 1; i <= Math.max(self.values.length, bitStr2.values.length); i++) {
			let addend1 = (self.values.length - i >= 0)? self.values[self.values.length - i] : 0;
			let addend2 = (bitStr2.values.length - i >= 0)? bitStr2.values[bitStr2.values.length - i] : 0;
			let sum = addend1 + addend2 + carry; // carry in from last digit
			carry = Math.floor(sum / 2); // carry out to next digit
			sum -= carry * 2;
			output.values.unshift(sum);
		}
		
		return output;
	}).bind(o, o);
	
	o.clone = (function(self) {
		return new BitString(self.values);
	}).bind(o, o);
	
	
	
	
	o.reassign(str);
	
	return o;
}

const SHA256 = function( plaintext ) {
	// Initialize hash values:
	// (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
	var h0 = new BitString(0x6a09e667), h1 = new BitString(0xbb67ae85), h2 = new BitString(0x3c6ef372), h3 = new BitString(0xa54ff53a), h4 = new BitString(0x510e527f), h5 = new BitString(0x9b05688c), h6 = new BitString(0x1f83d9ab), h7 = new BitString(0x5be0cd19);
	
	// Initialize array of round constants:
	// (first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311):
	var k = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	].map(x => new BitString(x));
	
	// Pre-processing (Padding):
	var message = new BitString(plaintext);
	
	var L = message.values.length;
	
	message.values.push(1);
	
	var K = (512 - (L + 65)) % 512;
	for(let i = 0; i < K; i++) {
		message.values.push(0);
	}
	
	var tempL = new BitString(L);
	while(tempL.values.length > 64) {
		tempL.values.shift();
	}
	while(tempL.values.length < 64) {
		tempL.values.unshift(0);
	}
	
	message.reassign( message.values.concat(tempL.values) );
	
	// Process the message in successive 512-bit chunks:
	var chunks = [];
	for(let i = Math.ceil(message.values.length / 512) * 512; i > 0 ; i -= 512) {
		let temp = new BitString(message.values.slice(i - 512, i-1));
		while(temp.values.length < 512) {
			temp.values.unshift(0);
		}
		chunks.unshift(temp);
	}
	for(let o of chunks) {
		let w = [];
		for(let i = 0; i < 64; i++) {
			// (The initial values in w[0..63] don't matter, so many implementations zero them here)
			w[i] = new BitString([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
		}
		
		for(let i = 0; i < 16; i++) {
			for(let j = 0; j < 32; j++) {
				w[i].values[j] = message.values[j + 32 * i];
			}
		}
		
		// Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array:
		for(let i = 16; i < 64; i++) {
			let s0 = w[i-15].clone().rightRotate(7).xor(w[i-15].clone().rightRotate(18)).xor(w[i-15].clone().rightShift(3));
			let s1 = w[i-2].clone().rightRotate(17).xor(w[i-2].clone().rightRotate(19)).xor(w[i-2].clone().rightShift(10));
			w[i] = w[i-16].clone().add(s0).add(w[i-7]).add(s1);
		}
		
		// Initialize working variables to current hash value:
		var a = h0.clone(), b = h1.clone(), c = h2.clone(), d = h3.clone(), e = h4.clone(), f = h5.clone(), g = h6.clone(), h = h7.clone();
		
		// Compression function main loop:
		for(let i = 0; i < 64; i++) {
			let S1 = e.clone().rightRotate(6).xor(e.clone().rightRotate(11)).xor(e.clone().rightRotate(25));
			let ch = e.clone().and(f).xor(e.clone().not().and(g));
			let temp1 = h.clone().add(S1).add(ch).add(k[i]).add(w[i]);
			let S0 = a.clone().rightRotate(2).xor(a.clone().rightRotate(13)).xor(a.clone().rightRotate(22));
			let maj = a.clone().and(b).xor(a.clone().and(c)).xor(b.clone().and(c));
			let temp2 = S0.clone().add(maj);
			
			h = g;
			g = f;
			f = e;
			e = d.add(temp1);
			d = c;
			c = b;
			b = a;
			a = temp1.add(temp2);
		}
		
		// Add the compressed chunk to the current hash value:
		h0 = h0.add(a);
		h1 = h1.add(b);
		h2 = h2.add(c);
		h3 = h3.add(d);
		h4 = h4.add(e);
		h5 = h5.add(f);
		h6 = h6.add(g);
		h7 = h7.add(h);
	}
	
	// Produce the final hash value (big-endian):
	let hash = new BitString(h0.clone().values.concat(h1.values).concat(h2.values).concat(h3.values).concat(h4.values).concat(h5.values).concat(h6.values).concat(h7.values));
	let digest = hash.toHex();
	
	while(digest.length % 64 != 0) {
		digest = "0"+ digest;
	}
	
	return digest;
}

module.exports = {
	SHA256
}
