# Pattern syntax

The current search engine supports the following pattern syntax:
- **Part-of-speech (POS) tag**: ***"VERB", "ADP", "PROPN", "NOUN", "ADJ", "ADV", "AUX", "PRON", "NUM"***
- **Word stemming**: ***[WORD]***  (e.g. *[have]* will be matched to all the variants of *have*, such as had, has, having)
- **Entity type**: ***$ENT_TYPE***  (e.g. *$LOCATION* will be matched to the words of location type, such as Houston, Boston)
- **Wildcard**: \* (match any sequence of words)
- **Regular expression**: ***(reg_exp)*** (match any word satisfying the given regular expression pattern). Please refer to this [cheat sheet](https://www.rexegg.com/regex-quickstart.html) for the regular expression syntax
- **Concrete word**: ***WORD***, note that the matching for a literal word is not case sensitive
- You can use *|* to combine different syntaxs for a word matching (e.g. ***VERB|$ORG|Store*** means match a word that is a verb, or of location type, or is literal *Store*)
- You can use *+* to concatenate different syntactic parts (i.e. the above syntaxs). For example, ***NOUN + * + Price*** means match sentences containing a NOUN word preceding the literal word *Price* 

## Example

#1: Find all the sentences that contains *good price* 
> good + price

#2: Find all the sentences that contains the structure: *a ADJ store*
> a + ADJ + store

#3: Find all the sentences that contains the structure: *NOUN|PROPN have a good (a entity of ORGIZATION type)*
> NOUN|PROPN + [have] + a + good + $ORG

#4: Find all the sentences that contains the structure: *NOUN have ... a great day!*
> NOUN + [have] + * + a + great + day + !

