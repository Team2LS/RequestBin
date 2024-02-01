const key = 'rhhBinIds'

function getSavedBinIds() {
  const binIdsString = window.localStorage[key]
  if (binIdsString == null) {
    return []
  }

  return JSON.parse(binIdsString);
}

function saveBinId(binId: string) {
  const binIds = getSavedBinIds();
  binIds.push(binId);
  window.localStorage[key] = JSON.stringify(binIds);
}

function clearStorage() {
  delete window.localStorage[key];
}

function invalidBin(binId: string) {
  const bins: string[] = getSavedBinIds();
  console.log(bins);
  return bins.includes(binId);
}

const localBins = {getSavedBinIds, saveBinId, clearStorage, invalidBin}

export default localBins