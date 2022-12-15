"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  let entries = await Promise.all(logSources.map(async (ls, index) => {
    const entry = await ls.pop()
    return {
      index,
      entry,
    }
  }))
  entries = entries
    .filter(log => log.entry !== false)
    .sort((a, b) => a.entry.date > b.entry.date ? 1 : -1)

  while (entries.length > 0) {
    const entry = entries.shift()
    printer.print(entry.entry)

    const newEntry = await logSources[entry.index].pop()
    if (newEntry) {
      let i
      for (i = 0; i < entries.length; i++) {
        if (newEntry.date < entries[i].entry.date) break
      }

      entries.splice(i, 0, {
        index: entry.index,
        entry: newEntry,
      })
    }
  }
  printer.done()

  return console.log("Async sort complete.");
};
