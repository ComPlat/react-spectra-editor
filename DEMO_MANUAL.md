# Demo & Manual

### 1. Standalone Demo

[1-1] Here are some [test examples](https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/demo-chem-spectra.zip). Please download the zip file and unzip it.

In this tutorial, we will use `demo.jdx` in the zip file.

[1-2] Please go to [the standalone demo page](https://eln.chemotion.net/chemspectra-editor).

[1-3] Follow the instruction in [3.Manual](https://github.com/ComPlat/react-spectra-editor/blob/master/DEMO_MANUAL.md#3-manual)

### 2. ELN Integration Demo

[2-1] To see this demo, you must sign-up at [the chemotion repository](https://www.chemotion-repository.net/home/welcome).

[2-2] Here is an [example](https://www.chemotion-repository.net/home/publications/reactions/2110).

Go to the example page -> click the flask icon (link to my DB) -> click the __Analyses__ tab -> click the __Spectra Editor__ button.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/a_eln_integration.gif" width="800">


---


### 3. Manual

using the standalone server as an example

##### [3-1] Submit a file.

1. Drag the file to the dashed box.

2. Click the __Submit__ button.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/1_submit.gif" width="800">

##### [3-2] Zoom-in & Zoom-out

1. Scroll the mouse to zoom in the y-direction.

2. Click __Zoom In__ to zoom a region.

3. Click __Reset Zoom__ to reset to the original scale.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/2_zoom.gif" width="800">

##### [3-3] Threshold to remove noise

1. Input or adjust value at __Threshold__.

2. Click __Reset Threshold__ to restore the original level.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/3_thres.gif" width="800">

##### [3-4] Add & delete peaks

1. Click __Add Peak__ to add a peak at the selected point.

2. Click __Remove Peak__ to delete a peak. You must select on an added peak to remove it.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/4_peak.gif" width="800">

##### [3-5] Solvent selection

1. There are 2 actions for solvent selection:
    - Click __Set Reference__ and select on an added peak.
    - Select a pre-defined solvent.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/5_solvent.gif" width="800">

##### [3-6] Integration

1. Click __Add Integration__ to assign a region for an integration.

2. Click __Remove Integration__ to delete an integration. You must select on an added integration to remove it.

3. Use __Set Integration Reference__ to adjust the reference area.

4. Click __Clear All Integration__ to remove all integration.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/6_integration.gif" width="800">

##### [3-7] Multiplicity

1. Click __Add Multiplicity__ to assign a region for a multiplicity. A multiplicity will be calculated based on red peaks. If there is no red peaks in the selected region, there will be no Multiplicity.

2. Click __Remove Multiplicity__ to delete a multiplicity. You must select on an added multiplicity to remove it.

3. Click __Add Peak for Multiplicity__ to add a peak to a selected multiplicity. You must check a multiplicity on the multiplicity panel on the right-hand side before adding peaks to it.

4. Click __Remove Peak for Multiplicity__ to remove a peak from a selected multiplicity. You must check a multiplicity on the multiplicity panel on the right-hand side before removing peaks from it.

5. To delete all multiplicities, you must click __Clear all Multiplicity__ & __Clear all Integration__.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/7_multiplicity.gif" width="800">

##### [3-8] Write peaks or multiplicity

1. Please select __Ascend__ or __Descend__ and proper __Decimal__, and select writing peaks or multiplictity, then click __Submit__. You will see the information at the bottom of the page.

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/8_write.gif" width="800">


##### [3-9] Compare spectra (IR only)

1. Click __Spectra Comparisons__ to upload spectra.

2. Click icons to hide/show or remove spectra.

3. _Compared spectra will not be exported!_

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/9_ir_compare.gif" width="800">


##### [3-10] Export results

1. Select __Save__ and click __Submit__ to export results.

2. There will be 3 files in the exported zip file.

- original file (orig_your_filename.ext)
- edited jcamp file (your_filename.ext)
- edited image (your_filename.png)

<img src="https://github.com/ComPlat/react-spectra-editor/blob/master/stories/demo/usage/10_export.gif" width="800">


