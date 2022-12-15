"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  let entries = logSources.map((ls, index) => ({
    index,
    entry: ls.pop(),
  }))
    .filter(log => log.entry !== false)
    .sort((a, b) => a.entry.date > b.entry.date ? 1 : -1)

  while (entries.length > 0) {
    const entry = entries.shift()
    printer.print(entry.entry)

    const newEntry = logSources[entry.index].pop()
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

  return console.log("Sync sort complete.")
};
