import { FormInputValues } from "./forms/FormInputValues";
import { ImageDraggableMetadata } from "./draggables/ImageDraggableMetadata";
import { PdfPage } from "./pdf/PdfPage";
import { TextDraggableMetadata } from "./draggables/TextDraggableMetadata";

/** View which is responsible for displaying the data from the controller. */
export class View {
  public readonly container: HTMLDivElement = document.getElementById(
    "pageContainer"
  ) as HTMLDivElement;
  public readonly pageListContainer: HTMLDivElement = document.getElementById(
    "pages"
  ) as HTMLDivElement;
  public readonly content = document.getElementById("content") as HTMLElement;

  public readonly contentInner = document.getElementById(
    "content-inner"
  ) as HTMLElement;

  /** Monotonic id used to link an image draggable to its "all pages" preview ghosts. */
  private ghostIdCounter = 0;

  public resetState() {
    (document.getElementById("pages") as HTMLElement).innerHTML = "";
    (document.getElementById("pageContainer") as HTMLElement).innerHTML = "";
    (document.getElementById("overlayContainer") as HTMLElement).innerHTML = "";
    (document.querySelector("#current-page") as HTMLElement).innerHTML = "1";
    (document.querySelector("#total-pages") as HTMLElement).innerHTML = "";
    (document.getElementById("empty-state") as HTMLElement).style.display =
      "none";
    this.disableNavButtons();
  }

  public enableNavButtons() {
    (document.getElementById("pdf-file") as HTMLElement).removeAttribute(
      "disabled"
    );
    (document.getElementById("save") as HTMLElement).removeAttribute(
      "disabled"
    );
    (document.getElementById("insert-text") as HTMLElement).removeAttribute(
      "disabled"
    );
    (document.getElementById("insert-image") as HTMLElement).removeAttribute(
      "disabled"
    );
    (document.getElementById("previous") as HTMLElement).removeAttribute(
      "disabled"
    );
    (document.getElementById("current-page") as HTMLElement).removeAttribute(
      "disabled"
    );
    (document.getElementById("next") as HTMLElement).removeAttribute(
      "disabled"
    );
    (
      document.getElementById("rotate-clockwise") as HTMLElement
    ).removeAttribute("disabled");
    (
      document.getElementById("rotate-counterclockwise") as HTMLElement
    ).removeAttribute("disabled");
  }

  public disableNavButtons() {
    (document.getElementById("pdf-file") as HTMLElement).setAttribute(
      "disabled",
      "true"
    );
    (document.getElementById("save") as HTMLElement).setAttribute(
      "disabled",
      "true"
    );
    (document.getElementById("insert-text") as HTMLElement).setAttribute(
      "disabled",
      "true"
    );
    (document.getElementById("insert-image") as HTMLElement).setAttribute(
      "disabled",
      "true"
    );
    (document.getElementById("previous") as HTMLElement).setAttribute(
      "disabled",
      "true"
    );
    (document.getElementById("current-page") as HTMLElement).setAttribute(
      "disabled",
      "true"
    );
    (document.getElementById("next") as HTMLElement).setAttribute(
      "disabled",
      "true"
    );
    (document.getElementById("rotate-clockwise") as HTMLElement).setAttribute(
      "disabled",
      "true"
    );
    (
      document.getElementById("rotate-counterclockwise") as HTMLElement
    ).setAttribute("disabled", "true");
  }

  public setOnNextClickedListener(onClickListener: () => void) {
    (document.getElementById("next") as HTMLElement).onclick = onClickListener;
  }

  public setOnPreviousClickedListener(onClickListener: () => void) {
    (document.getElementById("previous") as HTMLElement).onclick =
      onClickListener;
  }

  /** Updates the page number wherever relevant (such as the thumbnails) as the user scrolls. */
  public setOnContentScrollEventListener(
    scrollEvent: (currentPage: number) => void
  ) {
    const that = this;
    (document.getElementById("content") as HTMLElement).addEventListener(
      "scroll",
      function () {
        // Iterate through each element and check its position
        const elements = document.querySelectorAll(".page");
        var currentScrollPage = -1;
        const content = that.content;

        var minDist = Number.MAX_VALUE;
        elements?.forEach((element, index) => {
          const casted = element as HTMLElement;
          const dist = Math.abs(
            -content.scrollTop +
              casted.offsetTop +
              casted.offsetHeight / 2 -
              content.offsetHeight / 2
          );

          if (minDist > dist) {
            minDist = dist;
            currentScrollPage = index + 1;
          }
        });

        if (currentScrollPage != -1) {
          scrollEvent(currentScrollPage);
        }
      }
    );
  }

  public setOnRotateClockwiseClickListener(
    onRotateClickListener: () => Promise<void>
  ) {
    (document.getElementById("rotate-clockwise") as HTMLElement).onclick =
      onRotateClickListener;
  }

  public setOnRotateCounterClockwiseClickListener(
    onRotateClickListener: () => Promise<void>
  ) {
    (
      document.getElementById("rotate-counterclockwise") as HTMLElement
    ).onclick = onRotateClickListener;
  }

  public setOnCurrentPageFocusOutListener(
    onFocusOutListener: (event: FocusEvent) => void
  ) {
    (document.getElementById("current-page") as HTMLElement).addEventListener(
      "focusout",
      onFocusOutListener
    );
  }

  public setOnCurrentPageInputListener(
    onCurrentPageInputListener: (event: Event) => void
  ) {
    (document.getElementById("current-page") as HTMLElement).addEventListener(
      "input",
      onCurrentPageInputListener
    );
  }

  public setOnSaveClickedListener(onSaveClickedListener: () => Promise<void>) {
    (document.getElementById("save") as HTMLElement).onclick =
      onSaveClickedListener;
  }

  public setOnInsertTextClickListener() {
    const that = this;
    (document.getElementById("insert-text") as HTMLElement).onclick =
      async function () {
        (
          document.getElementById("overlayContainer") as HTMLElement
        ).insertAdjacentHTML(
          "beforeend",
          `
          <div class="text draggable focused" tabindex="0">
            <input type="text" class="text" value="" size="20" />
            <div class="text-options focused">
              <div class="img-container drag-handle">
                <img src="img/icon_drag.png" draggable="false" title="Drag text" />
              </div>
              <div class="separator"></div>
              <div class="img-container">
                <img src="img/icon_font_size.png" title="Change font size" />
              </div>
              <input type="number" class="fontSize" min="8" max="96" value="14" title="Change font size">
              <div class="separator"></div>
              <div class="img-container">
                <img src="img/icon_text_color.png" title="Change text color" />
              </div>
              <input type="color" class="fontColor" title="Change text color">
              <div class="separator"></div>
              <div class="img-container">
                <button class="options-delete" title="Delete this text" />
              </div>
            </div>
          </div>
          `
        );
        const draggables = document.querySelectorAll(".draggable");
        const newDraggable = draggables[draggables.length - 1] as HTMLElement;
        that.setupDraggable(newDraggable, draggables.length);

        const textInput = newDraggable.querySelector(
          "input[type=text].text"
        ) as HTMLElement;
        // Note that focusing scrolls the PDF page to the element
        textInput.focus();

        textInput.addEventListener("input", function (event: Event) {
          that.handleTextInputChange(event);
        });
        (
          newDraggable.querySelector(
            "input[type=number].fontSize"
          ) as HTMLElement
        ).addEventListener("input", function (event: Event) {
          that.handleFontSizeInputChange(event, newDraggable);
        });
        (
          newDraggable.querySelector(
            "input[type=color].fontColor"
          ) as HTMLElement
        ).addEventListener("input", function (event: Event) {
          that.handleFontColorInputChange(event, newDraggable);
        });
      };
  }

  /**
   * Wires up the "Insert image" flow. Clicking the toolbar button opens a modal
   * where the user picks the image, its scale, whether it should be stamped on
   * every page and where on the page it should be positioned. On confirm, the
   * image overlay is created accordingly.
   */
  public setOnInsertImageInputListener(
    validateBase64: (base64: string) => boolean
  ) {
    const that = this;
    const overlay = document.getElementById(
      "image-modal-overlay"
    ) as HTMLElement;
    const openBtn = document.getElementById("insert-image") as HTMLElement;
    const fileInput = document.getElementById(
      "modal-image-file"
    ) as HTMLInputElement;
    const previewWrap = document.getElementById(
      "modal-preview-wrap"
    ) as HTMLElement;
    const preview = document.getElementById(
      "modal-image-preview"
    ) as HTMLImageElement;
    const scaleInput = document.getElementById(
      "modal-image-scale"
    ) as HTMLInputElement;
    const allPagesInput = document.getElementById(
      "modal-all-pages"
    ) as HTMLInputElement;
    const positionSelect = document.getElementById(
      "modal-position"
    ) as HTMLSelectElement;
    const insertBtn = document.getElementById(
      "modal-insert"
    ) as HTMLButtonElement;
    const cancelBtn = document.getElementById(
      "modal-cancel"
    ) as HTMLButtonElement;

    let currentBase64: string | null = null;

    const closeModal = function () {
      overlay.setAttribute("hidden", "true");
    };

    const openModal = function () {
      fileInput.value = "";
      preview.src = "";
      previewWrap.style.display = "none";
      scaleInput.value = "100";
      allPagesInput.checked = false;
      positionSelect.value = "bottom-right";
      currentBase64 = null;
      insertBtn.disabled = true;
      overlay.removeAttribute("hidden");
    };

    openBtn.onclick = openModal;
    cancelBtn.onclick = closeModal;
    overlay.onclick = function (event: MouseEvent) {
      // Close only when clicking the dimmed backdrop, not the dialog itself.
      if (event.target === overlay) {
        closeModal();
      }
    };

    fileInput.onchange = function () {
      const file = fileInput.files?.[0];
      if (!file) {
        currentBase64 = null;
        insertBtn.disabled = true;
        previewWrap.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        const base64 = (e.target?.result as string) || null;
        if (base64 != null && validateBase64(base64)) {
          currentBase64 = base64;
          preview.src = base64;
          previewWrap.style.display = "block";
          insertBtn.disabled = false;
        } else {
          currentBase64 = null;
          insertBtn.disabled = true;
          previewWrap.style.display = "none";
          console.log("Invalid image format: must be either PNG or JPEG.");
        }
      };
      reader.readAsDataURL(file);
    };

    insertBtn.onclick = function () {
      if (currentBase64 == null) {
        return;
      }
      const scale = parseFloat(scaleInput.value) || 100;
      that.insertImageOverlay(
        currentBase64,
        scale,
        allPagesInput.checked,
        positionSelect.value
      );
      closeModal();
    };
  }

  /** Creates a draggable image overlay, scaled and positioned per the modal choices. */
  private insertImageOverlay(
    base64: string,
    scale: number,
    allPages: boolean,
    position: string
  ) {
    const that = this;
    (
      document.getElementById("overlayContainer") as HTMLElement
    ).insertAdjacentHTML(
      "beforeend",
      `
      <div class="image draggable focused" tabindex="0">
        <img class="image-wrapper" />
        <div class="text-options focused">
          <div class="img-container drag-handle">
            <img src="img/icon_drag.png" draggable="false" title="Drag image" />
          </div>
          <div class="separator"></div>
          <div class="img-container">
              <img src="img/icon_scale_image.png" title="Change image scale" />
            </div>
          <input type="number" class="scale" min="1" value="100" title="Change image scale">
          <div class="separator"></div>
          <label class="all-pages img-container" title="Stamp this image on the bottom-right of every page (e.g. a signature)">
            <input type="checkbox" class="applyToAllPages" />
            <span>All pages</span>
          </label>
          <div class="separator"></div>
          <div class="img-container">
            <button class="options-delete" title="Delete this image" />
          </div>
        </div>
      </div>
      `
    );

    const draggables = document.querySelectorAll(".draggable");
    const newDraggable = draggables[draggables.length - 1] as HTMLElement;
    newDraggable.dataset.imgId = String(++this.ghostIdCounter);
    that.setupDraggable(newDraggable, draggables.length);

    const scaleInput = newDraggable.querySelector(
      "input[type=number].scale"
    ) as HTMLInputElement;
    scaleInput.value = scale.toString();

    const allPagesCheckbox = newDraggable.querySelector(
      "input[type=checkbox].applyToAllPages"
    ) as HTMLInputElement;
    allPagesCheckbox.checked = allPages;
    allPagesCheckbox.addEventListener("change", function () {
      that.syncAllPagesGhosts(newDraggable);
    });

    const image = newDraggable.querySelector(
      ".image-wrapper"
    ) as HTMLImageElement;

    image.onload = function () {
      image.width = (image.naturalWidth * scale) / 100;
      image.height = (image.naturalHeight * scale) / 100;
      that.positionDraggableAtCorner(newDraggable, image, position);
      // Mirror the image onto every other page when "all pages" is enabled.
      that.syncAllPagesGhosts(newDraggable);
      // Note that focusing scrolls the PDF page to the element.
      newDraggable.focus();
    };
    image.src = base64;

    scaleInput.addEventListener("input", function (event: Event) {
      that.handleScaleInputChange(event, image);
      that.syncAllPagesGhosts(newDraggable);
    });
  }

  /**
   * Renders read-only preview copies ("ghosts") of an "all pages" image on
   * every page other than the one holding the editable draggable, so the user
   * can see the image will be stamped on all pages. Ghosts are excluded from
   * `getImageDraggableMetadata` and are re-created on move/scale/toggle.
   */
  private syncAllPagesGhosts(draggable: HTMLElement): void {
    const owner = draggable.dataset.imgId;
    if (owner == null) {
      return;
    }
    this.removeGhostsFor(owner);

    const checkbox = draggable.querySelector(
      "input[type=checkbox].applyToAllPages"
    ) as HTMLInputElement | null;
    const image = draggable.querySelector(
      ".image-wrapper"
    ) as HTMLImageElement | null;
    if (
      checkbox == null ||
      !checkbox.checked ||
      image == null ||
      !image.src ||
      !image.naturalWidth
    ) {
      return;
    }

    const imgWidth = image.width;
    const imgHeight = image.height;
    const refPage = this.pageContainingImage(image);
    if (refPage == null) {
      return;
    }
    const [imgX, imgY] = this.offsetRelativeToAncestor(image, this.contentInner);
    // Distance from the reference page's bottom-right corner, mirrored on every
    // page — the same anchoring the save step uses for "all pages".
    const rightGap = refPage.offsetLeft + refPage.offsetWidth - (imgX + imgWidth);
    const bottomGap =
      refPage.offsetTop + refPage.offsetHeight - (imgY + imgHeight);

    const overlayContainer = document.getElementById(
      "overlayContainer"
    ) as HTMLElement;
    this.getAllPages().forEach((p) => {
      const page = p as HTMLElement;
      if (page === refPage) {
        return; // the editable image is already visible on the reference page
      }
      const ghost = document.createElement("img");
      ghost.src = image.src;
      ghost.className = "all-pages-ghost";
      ghost.dataset.owner = owner;
      ghost.style.width = `${imgWidth}px`;
      ghost.style.height = `${imgHeight}px`;
      ghost.style.left = `${
        page.offsetLeft + page.offsetWidth - rightGap - imgWidth
      }px`;
      ghost.style.top = `${
        page.offsetTop + page.offsetHeight - bottomGap - imgHeight
      }px`;
      overlayContainer.appendChild(ghost);
    });
  }

  private removeGhostsFor(owner: string): void {
    document
      .querySelectorAll(`.all-pages-ghost[data-owner="${owner}"]`)
      .forEach((ghost) => ghost.remove());
  }

  /** Returns the page whose area contains the image's center (falls back to the current page). */
  private pageContainingImage(image: HTMLImageElement): HTMLElement | null {
    const [imgX, imgY] = this.offsetRelativeToAncestor(image, this.contentInner);
    const cx = imgX + image.width / 2;
    const cy = imgY + image.height / 2;
    const pages = this.getAllPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      if (
        cx >= page.offsetLeft &&
        cx <= page.offsetLeft + page.offsetWidth &&
        cy >= page.offsetTop &&
        cy <= page.offsetTop + page.offsetHeight
      ) {
        return page;
      }
    }
    return this.currentPageElement();
  }

  /** Returns the page element the user is currently viewing (falls back to the first page). */
  private currentPageElement(): HTMLElement | null {
    const pageInput = document.getElementById(
      "current-page"
    ) as HTMLInputElement | null;
    const pages = this.getAllPages();
    let pageNum = parseInt(pageInput?.value ?? "1");
    if (isNaN(pageNum) || pageNum < 1 || pageNum > pages.length) {
      pageNum = 1;
    }
    return (pages[pageNum - 1] as HTMLElement) ?? null;
  }

  /** Positions the draggable so the image lands at the requested corner of the current page. */
  private positionDraggableAtCorner(
    draggable: HTMLElement,
    image: HTMLImageElement,
    position: string
  ) {
    const page = this.currentPageElement();
    if (page == null) {
      return;
    }
    const margin = 20;
    const imgWidth = image.width;
    const imgHeight = image.height;
    const pageLeft = page.offsetLeft;
    const pageTop = page.offsetTop;
    const pageWidth = page.offsetWidth;
    const pageHeight = page.offsetHeight;

    let targetImgX: number;
    let targetImgY: number;
    switch (position) {
      case "bottom-left":
        targetImgX = pageLeft + margin;
        targetImgY = pageTop + pageHeight - margin - imgHeight;
        break;
      case "top-right":
        targetImgX = pageLeft + pageWidth - margin - imgWidth;
        targetImgY = pageTop + margin;
        break;
      case "top-left":
        targetImgX = pageLeft + margin;
        targetImgY = pageTop + margin;
        break;
      case "center":
        targetImgX = pageLeft + (pageWidth - imgWidth) / 2;
        targetImgY = pageTop + (pageHeight - imgHeight) / 2;
        break;
      case "bottom-right":
      default:
        targetImgX = pageLeft + pageWidth - margin - imgWidth;
        targetImgY = pageTop + pageHeight - margin - imgHeight;
        break;
    }

    // The image sits inside the draggable (behind its padding), so offset the
    // draggable by that inner gap to make the image itself hit the target.
    const [imgOffsetX, imgOffsetY] = this.offsetRelativeToAncestor(
      image,
      this.contentInner
    );
    const deltaX = imgOffsetX - draggable.offsetLeft;
    const deltaY = imgOffsetY - draggable.offsetTop;

    draggable.style.left = `${targetImgX - deltaX}px`;
    draggable.style.top = `${targetImgY - deltaY}px`;
  }

  public setOnPdfFileChosenListener(
    canChoosePdfPrecheck: () => boolean,
    onPdfFileChosen: (pdfFile: File) => Promise<void>
  ) {
    const pdfInput = document.getElementById(
      "pdf-file-input"
    ) as HTMLInputElement;
    pdfInput.onclick = function (e: Event) {
      pdfInput.value = "";
      if (!canChoosePdfPrecheck()) {
        e.preventDefault();
      }
    };
    pdfInput.onchange = async function (ev: Event) {
      const input = ev.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        onPdfFileChosen(input.files[0]);
      }
    };
  }

  /** Iterates through all form fields in the PDF and returns them as a `FormInputValues` object. */
  public extractFormInputValues(): FormInputValues {
    const that = this;
    const formInputValues: FormInputValues = new FormInputValues();

    const textInputElements = this.content.querySelectorAll(
      ':not(.draggable) > input[type="text"]'
    );
    textInputElements.forEach(function (inputElement) {
      const casted = inputElement as HTMLInputElement;
      formInputValues.textNameToValue.set(casted.name, casted.value);
    });

    const textAreaElements = this.content.querySelectorAll(
      ":not(.draggable) > textarea"
    );
    textAreaElements.forEach(function (textAreaElement) {
      const casted = textAreaElement as HTMLTextAreaElement;
      formInputValues.textNameToValue.set(casted.name, casted.value);
    });

    const checkboxInputElements = this.content.querySelectorAll(
      ':not(.draggable) > input[type="checkbox"]'
    );
    checkboxInputElements.forEach(function (inputElement) {
      const casted = inputElement as HTMLInputElement;
      formInputValues.checkboxNameToValue.set(casted.name, casted.checked);
    });

    const radioInputFields = this.content.querySelectorAll(
      ':not(.draggable) > input[type="radio"]'
    );
    const radioGroups: Set<string> = new Set();
    radioInputFields.forEach(function (inputElement) {
      const casted = inputElement as HTMLInputElement;
      radioGroups.add(casted.name);
    });
    radioGroups.forEach(function (groupName) {
      const radioButtons = Array.from(document.getElementsByName(groupName));
      var selected = radioButtons.find(
        (radioButton) => (radioButton as HTMLInputElement).checked
      );
      if (selected != null) {
        // pdfjs doesn't necessarily add form fields in the same order as
        // in the original PDF. Instead we rely on the zIndex which is in
        // the correct order.
        var minZIndex = that.calculateSmallestZIndex(
          radioButtons.map((el) => el.parentElement as HTMLElement)
        );
        var adjustedIndex =
          parseInt(
            getComputedStyle(selected.parentElement as HTMLElement).zIndex
          ) - minZIndex;
        formInputValues.radioGroupNameToSelectedIndex.set(
          groupName,
          adjustedIndex
        );
      }
    });

    const selectFields = this.content.querySelectorAll(
      ":not(.draggable) > select"
    );
    selectFields.forEach(function (selectElement) {
      const casted = selectElement as HTMLSelectElement;
      if (casted.size > 1) {
        formInputValues.optionNameToSelectedIndex.set(
          casted.name,
          casted.selectedIndex
        );
      } else {
        formInputValues.dropdownNameToSelectedIndex.set(
          casted.name,
          casted.selectedIndex
        );
      }
    });

    return formInputValues;
  }

  public setTotalPages(totalPages: number) {
    (document.querySelector("#total-pages") as HTMLElement).innerHTML =
      totalPages.toString();
  }

  public downloadBlob(data: Uint8Array, filename: string) {
    const blob = new Blob([data as BlobPart], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public createThumbnailPlaceholders(
    numThumbnails: number,
    thumbnailShownObserver: IntersectionObserver,
    onThumbnailClick: (pageNumber: number) => void
  ) {
    for (let i = 1; i <= numThumbnails; i++) {
      const div = document.createElement("div");
      div.classList.add("thumbnail-list-container");

      div.onclick = () => onThumbnailClick(i);

      const label = document.createElement("div");
      label.classList.add("thumbnail-list-label");
      label.innerHTML = `${i}`;

      const canvas = document.createElement("canvas");
      canvas.classList.add("thumbnail-list-canvas");
      canvas.setAttribute("data-pagenumber", `${i}`);

      div.append(canvas);
      div.append(label);

      this.pageListContainer.appendChild(div);
      thumbnailShownObserver.observe(canvas);
    }
  }

  public gotoPage(
    pageNumber: number,
    oldPage: number,
    scrollToPage: boolean = true
  ) {
    if (oldPage >= 0) {
      const previousPageElement = document.querySelector(
        `.thumbnail-list-container:nth-child(${oldPage})`
      ) as HTMLElement | null;
      if (previousPageElement) {
        previousPageElement.classList.remove(
          "thumbnail-list-container-selected"
        );
      }
    }

    (document.querySelector("#current-page") as HTMLInputElement).value =
      pageNumber.toString();

    const nthElement = document.querySelector(
      `.thumbnail-list-container:nth-child(${pageNumber})`
    ) as HTMLElement | null;
    if (nthElement) {
      nthElement.classList.add("thumbnail-list-container-selected");
    }

    nthElement?.scrollIntoView({
      block: "nearest",
    });

    if (scrollToPage) {
      const pageElement = document.querySelector(
        `.page:nth-child(${pageNumber})`
      ) as HTMLElement | null;
      if (pageElement != null) {
        pageElement.scrollIntoView({
          block: "start", // Scroll to the start of the target element
        });
      } else {
        console.log("page element null");
      }
    }
  }

  public calculateOriginalToActualRatio(
    pageNumber: number,
    pdfPage: PdfPage
  ): number {
    const [_, height] = pdfPage.getSize();
    const actualPdfHeight = (
      this.container.querySelectorAll(".page")[pageNumber - 1] as HTMLElement
    ).offsetHeight;
    return height / actualPdfHeight;
  }

  public getTextDraggableMetadata(): Array<TextDraggableMetadata> {
    const that = this;
    return Array.from(document.querySelectorAll(".draggable"))
      .filter((draggable) => draggable.classList.contains("text"))
      .map(function (draggable) {
        const casted = draggable as HTMLElement;
        const textInputCasted = draggable.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
        const offsetRelativeToAncestor = that.offsetRelativeToAncestor(
          textInputCasted,
          that.contentInner
        );
        const computedStyle = window.getComputedStyle(textInputCasted, null);
        return new TextDraggableMetadata(
          textInputCasted,
          textInputCasted.value,
          computedStyle.fontFamily,
          parseInt(computedStyle.fontSize),
          computedStyle.color,
          textInputCasted.offsetHeight,
          offsetRelativeToAncestor,
          /* draggableTopLeft = */ [casted.offsetLeft, casted.offsetTop],
          /* draggableBottomRight = */ [
            casted.offsetLeft + casted.offsetWidth,
            casted.offsetTop + casted.offsetHeight,
          ]
        );
      });
  }

  public getImageDraggableMetadata(): Array<ImageDraggableMetadata> {
    const that = this;
    return Array.from(document.querySelectorAll(".draggable"))
      .filter((draggable) => draggable.classList.contains("image"))
      .map(function (draggable) {
        const casted = draggable as HTMLElement;
        const scale =
          parseFloat(
            (
              draggable.querySelector(
                "input[type=number].scale"
              ) as HTMLInputElement
            ).value
          ) / 100;
        const image = draggable.querySelector(
          ".image-wrapper"
        ) as HTMLImageElement;

        const [offsetLeft, offsetTop] = that.offsetRelativeToAncestor(
          image,
          that.contentInner
        );
        const applyToAllPages =
          (
            draggable.querySelector(
              "input[type=checkbox].applyToAllPages"
            ) as HTMLInputElement | null
          )?.checked ?? false;
        return new ImageDraggableMetadata(
          image.src,
          [image.naturalWidth * scale, image.naturalHeight * scale],
          [offsetLeft, offsetTop],
          /* draggableTopLeft = */ [casted.offsetLeft, casted.offsetTop],
          /* draggableBottomRight = */ [
            casted.offsetLeft + casted.offsetWidth,
            casted.offsetTop + casted.offsetHeight,
          ],
          applyToAllPages
        );
      });
  }

  public getAllPages(): NodeListOf<Element> {
    return document.querySelectorAll("#content .page");
  }

  private calculateSmallestZIndex(collection: Array<HTMLElement>): number {
    return Math.min(
      ...Array.from(collection, (el) => parseInt(getComputedStyle(el).zIndex))
    );
  }

  private handleFontSizeInputChange(event: Event, newDraggable: HTMLElement) {
    // Access the current value of the input field
    const inputValue = (event.target as HTMLInputElement).value;

    // Convert the input value to a number
    const numericValue = parseFloat(inputValue);

    // Check if the conversion is successful and not NaN
    if (!isNaN(numericValue)) {
      (
        newDraggable.querySelector("input[type=text].text") as HTMLElement
      ).style.fontSize = `${numericValue}px`;
    } else {
      console.log("Invalid Input");
    }
  }

  private offsetRelativeToAncestor(
    child: HTMLElement,
    ancestor: HTMLElement
  ): [number, number] {
    var x: number = 0;
    var y: number = 0;

    var currentElement: HTMLElement | null = child;
    while (currentElement != ancestor && currentElement != null) {
      x += currentElement.offsetLeft;
      y += currentElement.offsetTop;
      currentElement = currentElement.parentElement;
    }

    return [x, y];
  }

  private handleTextInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    if (inputValue.length * 1.25 > input.size) {
      input.size = Math.max(inputValue.length * 1.25, 20);
    } else if (inputValue.length * 0.75 < input.size) {
      input.size = Math.max(inputValue.length * 1.25, 20);
    }
  }

  private handleFontColorInputChange(event: Event, newDraggable: HTMLElement) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue) {
      (
        newDraggable.querySelector("input[type=text].text") as HTMLElement
      ).style.color = inputValue;
    }
  }

  private handleScaleInputChange(event: Event, image: HTMLImageElement) {
    // Access the current value of the input field
    const inputValue = (event.target as HTMLInputElement).value;

    // Convert the input value to a number
    const numericValue = parseFloat(inputValue);

    // Check if the conversion is successful and not NaN
    if (!isNaN(numericValue)) {
      image.width = (image.naturalWidth * numericValue) / 100;
      image.height = (image.naturalHeight * numericValue) / 100;
    } else {
      console.log("Invalid Input");
    }
  }

  /** Sets up the draggable overlay's button options and dragging. */
  private setupDraggable(
    draggableElement: HTMLElement,
    numDraggables: number
  ): void {
    const that = this;
    let offsetX: number, offsetY: number;

    const scrollTop = (document.getElementById("content") as HTMLElement)
      .scrollTop;
    draggableElement.style.left = 50 + (numDraggables - 1) * 10 + "px";
    draggableElement.style.top =
      scrollTop + (50 + (numDraggables - 1) * 10) + "px";

    (draggableElement.querySelector(".options-delete") as HTMLElement).onclick =
      function () {
        const owner = draggableElement.dataset.imgId;
        if (owner != null) {
          that.removeGhostsFor(owner);
        }
        draggableElement.remove();
      };

    const mouseDownListener = function (event: MouseEvent) {
      offsetX = event.clientX - draggableElement.offsetLeft;
      offsetY = event.clientY - draggableElement.offsetTop;
      draggableElement.style.opacity = "0.7";

      window.addEventListener("mousemove", mouseMoveListener);
      window.addEventListener("mouseup", mouseUpListener);
    };
    const mouseMoveListener = function (event: MouseEvent) {
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;

      draggableElement.style.left = `${x}px`;
      draggableElement.style.top = `${y}px`;
    };
    const mouseUpListener = function (event: MouseEvent) {
      window.removeEventListener("mousemove", mouseMoveListener);
      window.removeEventListener("mouseup", mouseUpListener);
      draggableElement.style.opacity = "1";
      // Re-mirror the "all pages" ghosts to follow the new position.
      if (draggableElement.classList.contains("image")) {
        that.syncAllPagesGhosts(draggableElement);
      }
    };

    const a = draggableElement.querySelector(".drag-handle") as HTMLElement;
    a.addEventListener("mousedown", mouseDownListener);
    draggableElement.addEventListener("focusin", function (event: FocusEvent) {
      const targetElement: Element = event.target as Element;
      const parent = targetElement.closest(".draggable");
      if (
        parent != draggableElement ||
        draggableElement.classList.contains("focused")
      ) {
        return;
      }
      draggableElement.classList.remove("unfocused");
      draggableElement.classList.add("focused");
    });

    draggableElement.addEventListener("focusout", function (event: FocusEvent) {
      if (draggableElement.classList.contains("unfocused")) {
        return;
      }
      const newlyFocusedElement: Element = event.relatedTarget as Element;
      if (newlyFocusedElement != null) {
        const parent = newlyFocusedElement.closest(".draggable");
        if (parent == draggableElement) {
          return;
        }
      }

      draggableElement.classList.remove("focused");
      draggableElement.classList.add("unfocused");
    });
  }
}
