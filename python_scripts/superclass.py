from nltk.corpus import wordnet as wn

categories = ['animal', 'person', 'location']

def getSuperClass(word):
	try:
		word = word.lower() + '.n.01'
		syn = wn.synset(word)
		hyp = syn.hypernyms()[0]
		hyp_name = hyp.lemmas()[0].name()
		return hyp_name
	except Exception as e:
		return e

if __name__ == '__main__':
	print getSuperClass('dog')
	print getSuperClass('friend')
	print getSuperClass('learner')
	print getSuperClass('hack')
	print getSuperClass('people')
	print getSuperClass('video')
	print getSuperClass('stapler')
	print getSuperClass('playground')