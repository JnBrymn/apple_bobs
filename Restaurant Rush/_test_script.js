
    const screens = document.querySelectorAll(".screen");

    const SCREEN_NAMES = {
      1: "Garden",
      2: "Kitchen 1",
      3: "Kitchen 2",
      4: "Storefront",
      5: "Cashier",
      6: "Cafeteria",
    };

    function getScreenName(num) {
      return SCREEN_NAMES[num] || "Screen " + num;
    }

    function applyScreenLabels() {
      document.querySelectorAll(".screen[data-screen]").forEach((section) => {
        const num = Number(section.dataset.screen);
        const name = getScreenName(num);
        section.querySelectorAll(".corner-num").forEach((el) => {
          el.textContent = name;
        });
      });
      document.querySelectorAll(".nav-arrow[data-go]").forEach((btn) => {
        const num = Number(btn.dataset.go);
        const name = getScreenName(num);
        btn.setAttribute("aria-label", "Go to " + name);
        const destEl = btn.querySelector(".dest");
        if (destEl) destEl.textContent = name;
      });
    }

    function showScreen(num) {
      screens.forEach((s) => s.classList.remove("active"));
      const el = document.getElementById("screen-" + num);
      if (el) el.classList.add("active");
    }

    applyScreenLabels();

    const basket = document.getElementById("basket");
    const basketHome = document.getElementById("basketHome");
    const basketItem = document.getElementById("basketItem");
    const plate = document.getElementById("plate");
    const plateHome = document.getElementById("plateHome");
    const plateItem = document.getElementById("plateItem");
    const cup = document.getElementById("cup");
    const cupHome = document.getElementById("cupHome");
    const cupItem = document.getElementById("cupItem");
    const pot = document.getElementById("pot");
    const potHome = document.getElementById("potHome");
    const bowl = document.getElementById("bowl");
    const bowlHome = document.getElementById("bowlHome");
    const tray = document.getElementById("tray");
    const trayHome = document.getElementById("trayHome");
    const trayStackBadge = document.getElementById("trayStackBadge");
    const trayStackLayers = document.getElementById("trayStackLayers");
    const trayActionMenu = document.getElementById("trayActionMenu");
    const trayMenuPickUp = document.getElementById("trayMenuPickUp");
    const trayMenuPlaceFood = document.getElementById("trayMenuPlaceFood");
    const trayCloseup = document.getElementById("trayCloseup");
    const trayCloseupDone = document.getElementById("trayCloseupDone");
    const trayCloseupSources = document.getElementById("trayCloseupSources");
    const trayCloseupSlots = document.getElementById("trayCloseupSlots");
    const kitchenCuttingBoard = document.getElementById("kitchenCuttingBoard");
    const cuttingBoardZone = document.getElementById("cuttingBoardZone");
    const cuttingBoardFood = document.getElementById("cuttingBoardFood");
    const cuttingBoardTimer = document.getElementById("cuttingBoardTimer");
    const ovenZone = document.getElementById("ovenZone");
    const ovenFood = document.getElementById("ovenFood");
    const ovenTimer = document.getElementById("ovenTimer");
    const microwaveZone = document.getElementById("microwaveZone");
    const microwavePot = document.getElementById("microwavePot");
    const microwaveTimer = document.getElementById("microwaveTimer");
    const kitchenSink = document.getElementById("kitchenSink");
    const sinkBasin = document.getElementById("sinkBasin");
    const sinkItem = document.getElementById("sinkItem");
    const sinkSparkle = document.getElementById("sinkSparkle");
    const sinkWashTimer = document.getElementById("sinkWashTimer");
    const dishwasherZone = document.getElementById("dishwasherZone");
    const dishwasherItem = document.getElementById("dishwasherItem");
    const dishwasherWashTimer = document.getElementById("dishwasherWashTimer");
    const gardenRow = document.getElementById("gardenRow");
    const plants = gardenRow
      ? gardenRow.querySelectorAll(".plant[data-crop]")
      : [];

    let basketFollowing = false;
    let basketContents = null;
    let plateFollowing = false;
    let plateContents = null;
    let cupFollowing = false;
    let cupContents = null;
    let potFollowing = false;
    let potContents = null;
    let bowlFollowing = false;
    let bowlContents = null;
    let plateDirty = false;
    let cupDirty = false;
    let potDirty = false;
    let bowlDirty = false;
    let trayDirty = false;
    let plateRestSpotId = null;
    let cupRestSpotId = null;
    let potRestSpotId = null;
    let bowlRestSpotId = null;
    let trayFollowing = false;
    let trayRestSpotId = null;
    let trayAtCashier = false;
    let suppressTrayClickUntil = 0;
    let trayContents = { soup: null, drink: null, food: null, extra: null };
    let saltFollowing = false;
    let pepperFollowing = false;
    const counterSpotOccupants = new Map();
    const TRAY_SLOTS = ["soup", "drink", "food", "extra"];
    const TRAY_STACK_MAX = 4;
    let traysAtHome = TRAY_STACK_MAX;

    /** Counter food + shaker → which seasonings apply (see getSeasoningTargetKey) */
    const FOOD_SEASONING = {
      "pot:carrots:cold": { salt: true, pepper: true },
      "pot:cucumbers:cold": { salt: true, pepper: true },
      "pot:potato-soup-prep": { salt: true, pepper: true },
      "pot:tomato-soup-prep": { salt: true, pepper: true },
    };
    let sinkContents = null;
    let sinkWashing = false;
    let sinkTimerInterval = null;
    let dishwasherLoad = null;
    let dishwasherWashing = false;
    let dishwasherTimerInterval = null;
    let blenderResult = null;
    let blenderBlending = false;
    let blenderFruitFood = null;
    let blenderTimerInterval = null;
    let cuttingInProgress = false;
    let cuttingFood = null;
    let cuttingTimerInterval = null;
    let ovenBaking = false;
    let ovenBakingInput = null;
    let ovenResult = null;
    let ovenTimerInterval = null;
    let microwaveHeating = false;
    let microwaveHeatingSoup = null;
    let microwaveResult = null;
    let microwaveTimerInterval = null;
    const SINK_WASH_SEC = 3;
    const DISHWASHER_WASH_SEC = 3;
    const BLENDER_BLEND_SEC = 3;
    const CUT_SEC = 3;
    const OVEN_BAKE_SEC = 4;
    const MICROWAVE_HEAT_SEC = 3;
    const CUTTABLE_CROPS = new Set([
      "apples",
      "pineapple",
      "carrots",
      "cucumbers",
      "tomatoes",
      "potatoes",
    ]);
    const BLENDER_JUICE_CROPS = new Set(["grapes", "apples", "pineapple"]);
    const BLENDER_SOUP_CROPS = new Set(["carrots", "cucumbers", "potatoes", "tomatoes"]);
    const OVEN_CROPS = new Set([
      "apples",
      "grapes",
      "pineapple",
      "tomatoes",
      "carrots",
      "potatoes",
      "cucumbers",
      "beans",
    ]);

    const RECIPE_BOOK = [
      {
        id: "bread",
        name: "Bread",
        steps: "Wheat + Blender + Water + Oven",
      },
      {
        id: "baked-apples",
        name: "Baked apple",
        steps: "Apples + Oven",
      },
      {
        id: "baked-grapes",
        name: "Baked grapes",
        steps: "Grapes + Oven",
      },
      {
        id: "baked-pineapple",
        name: "Baked pineapple",
        steps: "Pineapple + Cutting board + Oven",
      },
      {
        id: "baked-tomatoes",
        name: "Baked tomato",
        steps: "Tomatoes + Oven",
      },
      {
        id: "baked-carrots",
        name: "Baked carrot",
        steps: "Carrots + Oven",
      },
      {
        id: "baked-potatoes",
        name: "Baked potato",
        steps: "Potatoes + Oven",
      },
      {
        id: "baked-cucumbers",
        name: "Baked cucumber",
        steps: "Cucumbers + Oven",
      },
      {
        id: "baked-beans",
        name: "Baked beans",
        steps: "Beans + Oven",
      },
      {
        id: "cut-apples",
        name: "Chopped apples",
        steps: "Apples + Cutting board",
      },
      {
        id: "cut-pineapple",
        name: "Chopped pineapple",
        steps: "Pineapple + Cutting board",
      },
      {
        id: "cut-carrots",
        name: "Chopped carrots",
        steps: "Carrots + Cutting board",
      },
      {
        id: "cut-cucumbers",
        name: "Chopped cucumbers",
        steps: "Cucumbers + Cutting board",
      },
      {
        id: "cut-tomatoes",
        name: "Chopped tomatoes",
        steps: "Tomatoes + Cutting board",
      },
      {
        id: "carrot-soup",
        name: "Carrot Soup",
        steps:
          "1) Carrots + Blender → cold soup in pot\n2) Kitchen 1: set pot on counter, add Salt then Pepper (before microwave!)\n3) Kitchen 2: Microwave → hot Carrot Soup",
      },
      {
        id: "cucumber-soup",
        name: "Cucumber Soup",
        steps:
          "1) Cucumbers + Blender → cold soup in pot\n2) Kitchen 1: Salt + Pepper on counter (before microwave!)\n3) Kitchen 2: Microwave → hot Cucumber Soup",
      },
      {
        id: "potato-soup",
        name: "Potato Soup",
        steps:
          "1) Potatoes + Blender → cold potato soup in pot\n2) Chopped carrots (Carrots + Cutting board) + combine on counter\n3) Kitchen 1: Salt + Pepper (before microwave!)\n4) Kitchen 2: Microwave → hot Potato Soup",
      },
      {
        id: "tomato-soup",
        name: "Tomato Soup",
        steps:
          "1) Tomatoes + Blender → cold tomato soup in pot\n2) Chopped tomatoes (Tomatoes + Cutting board) + combine on counter\n3) Kitchen 1: Salt + Pepper (before microwave!)\n4) Kitchen 2: Microwave → hot Tomato Soup",
      },
    ];

    const DRINK_LABELS = {
      water: "Water",
      milk: "Milk",
      sprite: "Sprite",
      rootbeer: "Root",
      coke: "Coke",
      lemonade: "Lemon",
      "juice-grapes": "Grape",
      "juice-apples": "Apple",
      "juice-pineapple": "Pine",
      "juice-tomatoes": "Tomato",
    };

    const SOUP_LABELS = {
      carrots: "Carrot",
      cucumbers: "Cuke",
      potatoes: "Potato",
      tomatoes: "Tomato",
    };

    const BOWL_LABELS = {
      flour: "Flour",
      dough: "Dough",
      batter: "Batter",
      "mix-apples": "Apple mix",
      "mix-pineapple": "Fruit mix",
    };

    const STEW_LABELS = {
      carrots: "Stew",
      cucumbers: "Stew",
      potatoes: "Chowder",
      tomatoes: "Stew",
    };

    const CASHIER_DRINK_LABELS = {
      water: "Water",
      milk: "Milk",
      sprite: "Sprite",
      rootbeer: "Root beer",
      coke: "Coke",
      lemonade: "Lemonade",
      "juice-grapes": "Grape juice",
      "juice-apples": "Apple juice",
      "juice-pineapple": "Pineapple juice",
      "juice-tomatoes": "Tomato juice",
    };

    const CASHIER_ORDER_DRINKS = Object.keys(CASHIER_DRINK_LABELS).map((drink) => ({
      kind: "drink",
      drink,
      label: CASHIER_DRINK_LABELS[drink],
    }));

    const CASHIER_ORDER_SOUPS = [
      { kind: "soup", recipe: "carrot", label: "Carrot soup" },
      { kind: "soup", recipe: "cucumber", label: "Cucumber soup" },
      { kind: "soup", recipe: "potato", label: "Potato soup" },
      { kind: "soup", recipe: "tomato", label: "Tomato soup" },
    ];

    const CASHIER_ORDER_FOODS = [
      { kind: "food", crop: "bread", state: "baked", label: "Bread" },
      { kind: "food", crop: "apples", state: "baked", label: "Baked apple" },
      { kind: "food", crop: "grapes", state: "baked", label: "Baked grapes" },
      {
        kind: "food",
        crop: "pineapple",
        state: "baked",
        wasCut: true,
        label: "Baked pineapple",
      },
      { kind: "food", crop: "tomatoes", state: "baked", label: "Baked tomato" },
      { kind: "food", crop: "carrots", state: "baked", label: "Baked carrot" },
      { kind: "food", crop: "potatoes", state: "baked", label: "Baked potato" },
      { kind: "food", crop: "cucumbers", state: "baked", label: "Baked cucumber" },
      { kind: "food", crop: "beans", state: "baked", label: "Baked beans" },
      { kind: "food", crop: "carrots", state: "cut", label: "Chopped carrots" },
      { kind: "food", crop: "cucumbers", state: "cut", label: "Chopped cucumbers" },
      { kind: "food", crop: "tomatoes", state: "cut", label: "Chopped tomatoes" },
      { kind: "food", crop: "potatoes", state: "cut", label: "Chopped potatoes" },
      { kind: "food", crop: "apples", state: "cut", label: "Chopped apples" },
      { kind: "food", crop: "pineapple", state: "cut", label: "Chopped pineapple" },
    ];

    const CASHIER_ORDER_COUNT_OPTIONS = (() => {
      const opts = [];
      for (let d = 1; d <= 2; d++) {
        for (let s = 0; s <= 2; s++) {
          for (let f = 0; f <= 2; f++) {
            const total = d + s + f;
            if (total < 2 || total > 4) continue;
            if (s + f < 1) continue;
            opts.push({ drink: d, soup: s, food: f });
          }
        }
      }
      return opts;
    })();

    let cashierCurrentOrder = null;
    let cashierSequenceBusy = false;
    let cashierLastOrderSig = "";
    let cashierToastTimer = null;

    function miniCupHtml(drinkId) {
      return (
        '<span class="mini-cup cup-' +
        drinkId +
        '" aria-hidden="true"><span class="mini-cup-liquid"></span></span>'
      );
    }

    const fridgeShelves = [null, null, null, null];
    const fridgeSlots = document.querySelectorAll(".fridge-slot");
    const kitchenFridge = document.getElementById("kitchenFridge");
    const kitchenDishwasher = document.getElementById("kitchenDishwasher");
    const kitchenMicrowave = document.getElementById("kitchenMicrowave");
    const kitchenCooler = document.getElementById("kitchenCooler");
    const coolerDrinks = kitchenCooler.querySelectorAll(".cooler-drink[data-drink]");
    const kitchenOven = document.getElementById("kitchenOven");
    const saltShaker = document.getElementById("saltShaker");
    const pepperShaker = document.getElementById("pepperShaker");
    const saltShakerDock = document.getElementById("saltShakerDock");
    const pepperShakerDock = document.getElementById("pepperShakerDock");
    const screen2 = document.getElementById("screen-2");
    const screen3 = document.getElementById("screen-3");
    const screen5 = document.getElementById("screen-5");
    const cashierTraySpot = document.getElementById("cashierTraySpot");
    const cashierTrayPreview = document.getElementById("cashierTrayPreview");
    const cashierCustomer = document.getElementById("cashierCustomer");
    const cashierCustomerArea = document.getElementById("cashierCustomerArea");
    const cashierCustomerTrayGrid = document.getElementById("cashierCustomerTrayGrid");
    const cashierCustomerOrder = document.getElementById("cashierCustomerOrder");
    const cashierGlassDoors = document.getElementById("cashierGlassDoors");
    const cashierOrderList = document.getElementById("cashierOrderList");
    const cashierToast = document.getElementById("cashierToast");
    const kitchenBlender = document.getElementById("kitchenBlender");
    const blenderZone = document.getElementById("blenderZone");
    const blenderJar = document.getElementById("blenderJar");
    const blenderFruit = document.getElementById("blenderFruit");
    const blenderWashTimer = document.getElementById("blenderWashTimer");
    const kitchenTrashCans = document.querySelectorAll(".kitchen-trash");
    const FRIDGE_ANIM_MS = 520;
    const APPLIANCE_ANIM_MS = 500;
    const applianceCloseFns = [];

    function makeFood(crop, state = "raw") {
      return { crop, state };
    }

    function isBasketFood(food) {
      return !!food && food.state === "raw";
    }

    function isPlateFood(food) {
      return (
        !!food &&
        (food.state === "washed" ||
          food.state === "cooked" ||
          food.state === "cut" ||
          food.state === "baked")
      );
    }

    function needsPineappleChopForOven(food) {
      return !!food && food.crop === "pineapple" && food.state === "washed";
    }

    function isOvenPlateInput(food) {
      if (!food || !OVEN_CROPS.has(food.crop)) return false;
      if (food.crop === "pineapple") return food.state === "cut";
      return food.state === "washed" || food.state === "cut";
    }

    function isBakedFood(food) {
      return !!food && food.state === "baked";
    }

    function foodLabel(food) {
      if (!food) return "food";
      if (food.state === "baked") {
        if (food.crop === "bread") return "bread";
        if (food.crop === "apples") return "baked apple";
        const short = {
          grapes: "grapes",
          pineapple: "pineapple",
          tomatoes: "tomato",
          carrots: "carrot",
          potatoes: "potato",
          cucumbers: "cucumber",
          beans: "beans",
        };
        return "baked " + (short[food.crop] || food.crop);
      }
      if (food.state === "cut") return "cut " + food.crop;
      return food.crop;
    }

    function bakeFoodFromInput(input) {
      if (input && input.kind === "dough") return makeFood("bread", "baked");
      if (input && input.kind === "food" && input.food) {
        const baked = makeFood(input.food.crop, "baked");
        if (input.food.state === "cut") baked.wasCut = true;
        return baked;
      }
      return null;
    }

    function makeDrink(id) {
      return { drink: id };
    }

    function isCupDrink(item) {
      return !!item && !!item.drink;
    }

    function isCuttable(food) {
      return (
        !!food &&
        !isBakedFood(food) &&
        food.state === "washed" &&
        CUTTABLE_CROPS.has(food.crop)
      );
    }

    function isBlenderInput(food) {
      return (
        !!food &&
        !isBakedFood(food) &&
        (food.state === "washed" || food.state === "cut") &&
        (BLENDER_JUICE_CROPS.has(food.crop) ||
          BLENDER_SOUP_CROPS.has(food.crop) ||
          food.crop === "wheat")
      );
    }

    function makePotSoup(crop, cold = false) {
      const item = { soup: crop };
      if (cold) {
        item.cold = true;
        item.salted = false;
        item.peppered = false;
      }
      return item;
    }

    function isPotSoup(item) {
      return !!item && !!item.soup;
    }

    function isPotSoupCold(item) {
      return isPotSoup(item) && !!item.cold && !item.complete;
    }

    function makePotSoupMix(baseSoup, mixCrop) {
      return {
        soup: baseSoup,
        stew: true,
        mix: mixCrop,
        cold: true,
        salted: false,
        peppered: false,
      };
    }

    function isFinishedSoupPrep(item) {
      if (!isPotSoup(item) || !item.stew || !item.cold || item.complete) return false;
      return (
        (item.soup === "potatoes" && item.mix === "carrots") ||
        (item.soup === "tomatoes" && item.mix === "tomatoes")
      );
    }

    function isPotSoupSeasonedForMicrowave(item) {
      if (!isPotSoupCold(item)) return false;
      return !!item.salted && !!item.peppered;
    }

    function isPotSoupReadyForMicrowave(item) {
      if (!isPotSoupSeasonedForMicrowave(item)) return false;
      if (item.soup === "potatoes" || item.soup === "tomatoes") {
        return isFinishedSoupPrep(item);
      }
      return true;
    }

    function isFinishedSoupComplete(item) {
      return isPotSoup(item) && !!item.complete;
    }

    function heatPotSoup(item) {
      if (!isPotSoup(item) || !isPotSoupCold(item)) return item;
      if (!item.salted || !item.peppered) return item;
      const hot = {
        soup: item.soup,
        complete: true,
        salted: true,
        peppered: true,
      };
      if (item.stew) hot.stew = true;
      if (item.mix) hot.mix = item.mix;
      return hot;
    }

    function soupLabel(soupItem) {
      if (!soupItem) return "Soup";
      if (isFinishedSoupComplete(soupItem)) {
        if (soupItem.soup === "potatoes" && soupItem.mix === "carrots") return "Potato Soup";
        if (soupItem.soup === "tomatoes" && soupItem.mix === "tomatoes") return "Tomato Soup";
        const name = SOUP_LABELS[soupItem.soup] || soupItem.soup;
        return name + " Soup";
      }
      if (isPotStew(soupItem)) return STEW_LABELS[soupItem.soup] || "Stew";
      const base = SOUP_LABELS[soupItem.soup] || soupItem.soup;
      if (isPotSoupCold(soupItem)) return "Cold " + base;
      return base;
    }

    function makeBowlFlour() {
      return { flour: true };
    }

    function makeBowlDough() {
      return { dough: true };
    }

    function makeBowlBatter() {
      return { batter: true };
    }

    function makeBowlMix(crop) {
      return { mix: crop };
    }

    function makePotStew(crop) {
      return { soup: crop, stew: true };
    }

    function isBowlFlour(item) {
      return !!item && !!item.flour;
    }

    function isBowlDough(item) {
      return !!item && !!item.dough;
    }

    function isBowlBatter(item) {
      return !!item && !!item.batter;
    }

    function isBowlMix(item) {
      return !!item && !!item.mix;
    }

    function isBowlItem(item) {
      return isBowlFlour(item) || isBowlDough(item) || isBowlBatter(item) || isBowlMix(item);
    }

    function isPotStew(item) {
      return isPotSoup(item) && !!item.stew;
    }

    function isPlateCut(food) {
      return !!food && food.state === "cut";
    }

    function cupHasDrink(item, drinkId) {
      return isCupDrink(item) && item.drink === drinkId;
    }

    function miniBowlHtml(fillClass) {
      const fill = fillClass || "mini-bowl-flour";
      return (
        '<span class="mini-bowl" aria-hidden="true">' +
        '<span class="mini-bowl-flour ' +
        fill +
        '"></span></span>'
      );
    }

    function bowlFillClass(item) {
      if (isBowlFlour(item)) return "mini-bowl-flour";
      if (isBowlDough(item)) return "mini-bowl-fill-dough";
      if (isBowlBatter(item)) return "mini-bowl-fill-batter";
      if (isBowlMix(item)) return "mini-bowl-fill-mix-" + item.mix;
      return "mini-bowl-flour";
    }

    function bowlLabel(item) {
      if (isBowlFlour(item)) return BOWL_LABELS.flour;
      if (isBowlDough(item)) return BOWL_LABELS.dough;
      if (isBowlBatter(item)) return BOWL_LABELS.batter;
      if (isBowlMix(item)) return BOWL_LABELS["mix-" + item.mix] || "Mix";
      return "Bowl";
    }

    function setBowlIcon(el, baseClass, bowlItem) {
      if (!bowlItem) {
        el.className = baseClass;
        el.innerHTML = "";
        return;
      }
      el.className = baseClass + " slot-icon-wrap flour-icon";
      el.innerHTML =
        miniBowlHtml(bowlFillClass(bowlItem)) +
        '<span class="item-label">' +
        bowlLabel(bowlItem) +
        "</span>";
    }

    function clearBowlFillClasses() {
      bowl.classList.remove("bowl-flour", "bowl-dough", "bowl-batter");
      [...bowl.classList].forEach((cls) => {
        if (cls.startsWith("bowl-mix-")) bowl.classList.remove(cls);
      });
    }

    function syncBowlVisual() {
      clearBowlFillClasses();
      if (!bowlContents) return;
      if (isBowlFlour(bowlContents)) bowl.classList.add("bowl-flour");
      else if (isBowlDough(bowlContents)) bowl.classList.add("bowl-dough");
      else if (isBowlBatter(bowlContents)) bowl.classList.add("bowl-batter");
      else if (isBowlMix(bowlContents)) bowl.classList.add("bowl-mix-" + bowlContents.mix);
    }

    const COUNTER_RECIPES = [
      {
        on: "bowl",
        onMatch: isBowlFlour,
        with: "cup",
        withMatch: (p) => cupHasDrink(p, "water"),
        result: makeBowlDough,
        dirtyWith: true,
      },
      {
        on: "bowl",
        onMatch: isBowlFlour,
        with: "cup",
        withMatch: (p) => cupHasDrink(p, "milk"),
        result: makeBowlBatter,
        dirtyWith: true,
      },
      {
        on: "bowl",
        onMatch: isBowlDough,
        with: "plate",
        withMatch: (p) => isPlateCut(p) && p.crop === "apples",
        result: () => makeBowlMix("apples"),
        dirtyWith: true,
      },
      {
        on: "bowl",
        onMatch: isBowlDough,
        with: "plate",
        withMatch: (p) => isPlateCut(p) && p.crop === "pineapple",
        result: () => makeBowlMix("pineapple"),
        dirtyWith: true,
      },
      {
        on: "pot",
        onMatch: (p) => isPotSoup(p) && !p.stew && p.soup === "carrots",
        with: "plate",
        withMatch: (p) => isPlateCut(p) && p.crop === "carrots",
        result: () => makePotStew("carrots"),
        dirtyWith: true,
      },
      {
        on: "pot",
        onMatch: (p) => isPotSoup(p) && !p.stew && p.soup === "cucumbers",
        with: "plate",
        withMatch: (p) => isPlateCut(p) && p.crop === "cucumbers",
        result: () => makePotStew("cucumbers"),
        dirtyWith: true,
      },
      {
        on: "pot",
        onMatch: (p) => isPotSoup(p) && !p.stew && p.soup === "potatoes",
        with: "plate",
        withMatch: (p) => isPlateCut(p) && p.crop === "carrots",
        result: () => makePotSoupMix("potatoes", "carrots"),
        dirtyWith: true,
      },
      {
        on: "pot",
        onMatch: (p) => isPotSoup(p) && !p.stew && p.soup === "tomatoes",
        with: "plate",
        withMatch: (p) => isPlateCut(p) && p.crop === "tomatoes",
        result: () => makePotSoupMix("tomatoes", "tomatoes"),
        dirtyWith: true,
      },
      {
        on: "bowl",
        onMatch: isBowlBatter,
        with: "pot",
        withMatch: (p) => isPotStew(p) && p.soup === "potatoes",
        result: () => makePotStew("potatoes"),
        resultOn: "with",
        dirtyOn: true,
      },
    ];

    function findCounterRecipe(onCarrier, onPayload, withCarrier, withPayload) {
      for (const r of COUNTER_RECIPES) {
        if (
          r.on === onCarrier &&
          r.onMatch(onPayload) &&
          r.with === withCarrier &&
          r.withMatch(withPayload)
        ) {
          return r;
        }
      }
      return null;
    }

    function recipeResultCarrier(recipe, onCarrier, withCarrier) {
      if (recipe.resultOn === "with") return withCarrier;
      return onCarrier;
    }

    function canCounterCombineAtSpot(spotId) {
      const incoming = getFollowingRestCarrier();
      if (!incoming) return false;
      if (getCarrierDirty(incoming)) return false;
      const existing = counterSpotOccupants.get(spotId);
      if (!existing) return false;
      if (getCarrierDirty(existing)) return false;
      const existingPayload = getCarrierPayload(existing);
      const incomingPayload = getCarrierPayload(incoming);
      if (!existingPayload || !incomingPayload) return false;
      return (
        !!findCounterRecipe(existing, existingPayload, incoming, incomingPayload) ||
        !!findCounterRecipe(incoming, incomingPayload, existing, existingPayload)
      );
    }

    function getCarrierPayload(carrier) {
      if (carrier === "plate") return plateContents;
      if (carrier === "cup") return cupContents;
      if (carrier === "pot") return potContents;
      if (carrier === "bowl") return bowlContents;
      return null;
    }

    function getCarrierDirty(carrier) {
      if (carrier === "plate") return plateDirty;
      if (carrier === "cup") return cupDirty;
      if (carrier === "pot") return potDirty;
      if (carrier === "bowl") return bowlDirty;
      if (carrier === "tray") return trayDirty;
      return false;
    }

    function setCarrierDirty(carrier, dirty) {
      if (carrier === "plate") plateDirty = dirty;
      else if (carrier === "cup") cupDirty = dirty;
      else if (carrier === "pot") potDirty = dirty;
      else if (carrier === "bowl") bowlDirty = dirty;
      else if (carrier === "tray") trayDirty = dirty;
    }

    function applyCarrierPayload(carrier, item) {
      if (carrier === "plate") setPlateFood(item);
      else if (carrier === "cup") setCupDrink(item);
      else if (carrier === "pot") setPotSoup(item);
      else if (carrier === "bowl") setBowlItem(item);
    }

    function clearCarrierPayload(carrier) {
      if (carrier === "plate") clearPlate();
      else if (carrier === "cup") clearCup();
      else if (carrier === "pot") clearPot();
      else if (carrier === "bowl") clearBowl();
    }

    function stopCarrierFollowing(carrier) {
      const el = getCarrierEl(carrier);
      const home = getCarrierHome(carrier);
      if (carrier === "plate") plateFollowing = false;
      else if (carrier === "cup") cupFollowing = false;
      else if (carrier === "pot") potFollowing = false;
      else if (carrier === "bowl") bowlFollowing = false;
      else if (carrier === "tray") trayFollowing = false;
      el.classList.remove("following");
      el.setAttribute("aria-label", "Pick up from counter");
      home.classList.add("is-empty");
    }

    function flashCounterCombo(spotEl) {
      spotEl.classList.add("combo-flash");
      setTimeout(() => spotEl.classList.remove("combo-flash"), 600);
    }

    function miniPotHtml(crop, cold) {
      return (
        '<span class="mini-pot soup-' +
        crop +
        (cold ? " soup-cold" : "") +
        '" aria-hidden="true"><span class="mini-pot-soup"></span></span>'
      );
    }

    function foodSlicesHtml(crop) {
      return (
        '<span class="food-slices food-slices-' +
        crop +
        '" aria-hidden="true">' +
        '<span class="slice s1"></span>' +
        '<span class="slice s2"></span>' +
        '<span class="slice s3"></span>' +
        "</span>"
      );
    }

    function setFoodIcon(el, baseClass, food) {
      if (!food) {
        el.className = baseClass;
        el.innerHTML = "";
        return;
      }
      if (food.state === "baked") {
        if (food.wasCut) {
          el.className =
            baseClass + " food-icon food-" + food.crop + " food-baked food-cut";
          el.innerHTML = foodSlicesHtml(food.crop);
          return;
        }
        el.className = baseClass + " food-icon food-" + food.crop + " food-baked";
        el.innerHTML = '<span class="food-shape" aria-hidden="true"></span>';
        return;
      }
      if (food.state === "cut") {
        el.className = baseClass + " food-icon food-" + food.crop + " food-cut";
        el.innerHTML = foodSlicesHtml(food.crop);
        return;
      }
      el.className = baseClass + " food-icon food-" + food.crop;
      el.innerHTML = '<span class="food-shape" aria-hidden="true"></span>';
    }

    function setSoupIcon(el, baseClass, soupItem) {
      if (!soupItem) {
        el.className = baseClass;
        el.innerHTML = "";
        return;
      }
      const label = soupLabel(soupItem);
      el.className = baseClass + " slot-icon-wrap soup-icon";
      el.innerHTML =
        miniPotHtml(soupItem.soup, isPotSoupCold(soupItem)) +
        '<span class="item-label">' +
        label +
        "</span>";
    }

    function setDrinkIcon(el, baseClass, drink) {
      if (!drink) {
        el.className = baseClass;
        el.innerHTML = "";
        return;
      }
      const label = DRINK_LABELS[drink.drink] || drink.drink;
      el.className = baseClass + " slot-icon-wrap drink-icon";
      el.innerHTML =
        miniCupHtml(drink.drink) + '<span class="item-label">' + label + "</span>";
    }

    function clearCupDrinkClasses() {
      [...cup.classList].forEach((cls) => {
        if (cls.startsWith("drink-")) cup.classList.remove(cls);
      });
    }

    function clearBlenderJarClasses() {
      [...blenderJar.classList].forEach((cls) => {
        if (
          cls === "has-juice" ||
          cls === "has-fruit" ||
          cls === "blend-wheat" ||
          cls.startsWith("juice-") ||
          cls.startsWith("soup-")
        ) {
          blenderJar.classList.remove(cls);
        }
      });
    }

    function clearPotSoupClasses() {
      [...pot.classList].forEach((cls) => {
        if (cls.startsWith("soup-")) pot.classList.remove(cls);
      });
    }

    function isScreen2Active() {
      const active = document.querySelector(".screen.active");
      return active === screen2;
    }

    function isScreen5Active() {
      const active = document.querySelector(".screen.active");
      return active === screen5;
    }

    function trayHasDrink() {
      return !!trayContents.drink;
    }

    function trayHasFoodOrSoup() {
      return !!trayContents.food || !!trayContents.soup;
    }

    function trayMeetsCashierMinimum() {
      return trayHasDrink() && trayHasFoodOrSoup();
    }

    function trayFilledCount() {
      return TRAY_SLOTS.filter((slot) => !!trayContents[slot]).length;
    }

    function trayHasLoad() {
      return trayFilledCount() > 0;
    }

    function isTrayOutInWorld() {
      return (
        trayFollowing ||
        !!trayRestSpotId ||
        trayAtCashier ||
        dishwasherLoad === "tray"
      );
    }

    function isTrayOnHomeDock() {
      return traysAtHome > 0 && !isTrayOutInWorld();
    }

    function reconcileTrayStackCount() {
      traysAtHome = isTrayOutInWorld()
        ? TRAY_STACK_MAX - 1
        : TRAY_STACK_MAX;
    }

    function updateTrayStackUI() {
      reconcileTrayStackCount();
      const stackedAtHome = traysAtHome;
      if (trayStackBadge) {
        trayStackBadge.textContent = String(stackedAtHome);
        trayStackBadge.hidden = stackedAtHome < 1;
        trayStackBadge.setAttribute(
          "aria-label",
          stackedAtHome === 1
            ? "1 tray at home"
            : stackedAtHome + " trays at home"
        );
      }
      if (trayStackLayers) {
        const behind = Math.max(0, Math.min(traysAtHome - 1, TRAY_STACK_MAX - 1));
        trayStackLayers.innerHTML = "";
        for (let i = 0; i < behind; i++) {
          const layer = document.createElement("div");
          layer.className = "tray-stack-layer";
          layer.style.setProperty("--stack-i", String(i));
          trayStackLayers.appendChild(layer);
        }
      }
      trayHome.classList.toggle("has-stack", traysAtHome > 1);
      const canPickFromHome = traysAtHome > 0 && !isTrayOutInWorld();
      trayHome.classList.toggle("is-empty", !canPickFromHome);
      if (isTrayOnHomeDock()) {
        returnCarrierToHomeDock("tray");
      }
    }

    function trayItemMatchesReq(data, req) {
      if (!data || !req) return false;
      if (req.kind === "drink") {
        return isCupDrink(data) && data.drink === req.drink;
      }
      if (req.kind === "food") {
        if (!isPlateFood(data)) return false;
        if (req.crop && data.crop !== req.crop) return false;
        if (req.state && data.state !== req.state) return false;
        if (req.wasCut !== undefined && !!data.wasCut !== req.wasCut) return false;
        return true;
      }
      if (req.kind === "soup") {
        if (!isFinishedSoupComplete(data)) return false;
        if (req.recipe === "carrot") return data.soup === "carrots";
        if (req.recipe === "cucumber") return data.soup === "cucumbers";
        if (req.recipe === "potato") {
          return data.soup === "potatoes" && data.mix === "carrots";
        }
        if (req.recipe === "tomato") {
          return data.soup === "tomatoes" && data.mix === "tomatoes";
        }
        return data.soup === req.recipe;
      }
      return false;
    }

    function trayMatchesCashierOrder(order) {
      if (!order) return false;
      const filled = TRAY_SLOTS.map((slot) => trayContents[slot])
        .filter(Boolean)
        .map((entry) => entry.data);
      if (filled.length !== order.items.length) return false;
      const used = new Set();
      return order.items.every((req) => {
        const idx = filled.findIndex(
          (data, i) => !used.has(i) && trayItemMatchesReq(data, req)
        );
        if (idx === -1) return false;
        used.add(idx);
        return true;
      });
    }

    function clearTrayContents() {
      TRAY_SLOTS.forEach((slot) => {
        trayContents[slot] = null;
      });
      updateTrayVisual();
    }

    function throwAwayTrayFoodOnly() {
      clearTrayContents();
      trayDirty = true;
      if (trayAtCashier) {
        renderCashierTrayPreview();
      }
      updateCarrierUI();
    }

    function trayCanThrowAway() {
      if (!trayHasLoad()) return false;
      if (trayFollowing) return true;
      if (trayAtCashier) return true;
      if (trayRestSpotId) {
        const active = document.querySelector(".screen.active");
        return active === screen2 || active === screen3;
      }
      return false;
    }

    function showCashierToast(kind, message) {
      if (cashierToastTimer) {
        clearTimeout(cashierToastTimer);
        cashierToastTimer = null;
      }
      cashierToast.hidden = false;
      cashierToast.className = "cashier-toast " + kind;
      cashierToast.textContent = message;
      cashierToastTimer = setTimeout(() => {
        cashierToast.hidden = true;
        cashierToastTimer = null;
      }, kind === "success" ? 1600 : 2000);
    }

    function renderCashierOrder() {
      if (!cashierOrderList) return;
      cashierOrderList.innerHTML = "";
      if (!cashierCurrentOrder || !cashierCurrentOrder.items) return;
      cashierCurrentOrder.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.label;
        cashierOrderList.appendChild(li);
      });
    }

    function pickRandomCashierCatalogItems(catalog, count) {
      const pool = catalog.slice();
      const picked = [];
      for (let n = 0; n < count && pool.length; n++) {
        const i = Math.floor(Math.random() * pool.length);
        picked.push({ ...pool[i] });
        pool.splice(i, 1);
      }
      return picked;
    }

    function shuffleCashierOrderItems(items) {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
      }
      return items;
    }

    function cashierOrderSignature(order) {
      return order.items
        .map((item) => item.kind + ":" + item.label)
        .sort()
        .join("|");
    }

    function buildCashierOrder() {
      const counts =
        CASHIER_ORDER_COUNT_OPTIONS[
          Math.floor(Math.random() * CASHIER_ORDER_COUNT_OPTIONS.length)
        ];
      const items = [
        ...pickRandomCashierCatalogItems(
          CASHIER_ORDER_DRINKS,
          counts.drink
        ),
        ...pickRandomCashierCatalogItems(CASHIER_ORDER_SOUPS, counts.soup),
        ...pickRandomCashierCatalogItems(CASHIER_ORDER_FOODS, counts.food),
      ];
      shuffleCashierOrderItems(items);
      return { items };
    }

    function pickCashierOrder() {
      for (let attempt = 0; attempt < 16; attempt++) {
        const order = buildCashierOrder();
        const sig = cashierOrderSignature(order);
        if (sig !== cashierLastOrderSig) {
          cashierLastOrderSig = sig;
          return {
            items: order.items.map((item) => ({ ...item })),
          };
        }
      }
      const order = buildCashierOrder();
      cashierLastOrderSig = cashierOrderSignature(order);
      return {
        items: order.items.map((item) => ({ ...item })),
      };
    }

    function ensureCashierCustomer() {
      const listEmpty =
        !cashierOrderList || cashierOrderList.children.length === 0;
      if (
        !cashierCurrentOrder ||
        !cashierCurrentOrder.items?.length ||
        listEmpty
      ) {
        spawnCashierCustomer();
      } else {
        renderCashierOrder();
      }
    }

    function randomCustomerLook() {
      const gender = Math.random() < 0.5 ? "boy" : "girl";
      const skins = ["pale", "peach", "dark"];
      const skin = skins[Math.floor(Math.random() * skins.length)];
      const hasLipstick = gender === "girl" && Math.random() < 0.4;
      return { gender, skin, hasLipstick };
    }

    function applyCustomerLook() {
      if (!cashierCustomer) return;
      const look = randomCustomerLook();
      cashierCustomer.className =
        "customer customer-" + look.gender + " skin-" + look.skin;
      if (look.hasLipstick) {
        cashierCustomer.classList.add("has-lipstick");
      }
    }

    const CASHIER_DOOR_MS = 560;
    const CASHIER_WALK_MS = 1000;
    const CASHIER_EXIT_MS = 950;

    function setCashierDoorsOpen(open) {
      if (!cashierGlassDoors) return;
      cashierGlassDoors.classList.toggle("doors-open", open);
    }

    function waitMs(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function waitCustomerAreaTransition(fallbackMs) {
      return new Promise((resolve) => {
        if (!cashierCustomerArea) {
          resolve();
          return;
        }
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          cashierCustomerArea.removeEventListener("transitionend", onEnd);
          resolve();
        };
        const onEnd = (e) => {
          if (e.target !== cashierCustomerArea) return;
          if (e.propertyName !== "bottom" && e.propertyName !== "transform") {
            return;
          }
          finish();
        };
        cashierCustomerArea.addEventListener("transitionend", onEnd);
        window.setTimeout(finish, fallbackMs);
      });
    }

    function setCustomerMotionState(state, options) {
      if (!cashierCustomerArea) return;
      const instant = options && options.instant;
      const motionClasses = [
        "is-at-counter",
        "is-behind-doors",
        "is-exiting-through-door",
        "is-walking-to-counter",
      ];
      cashierCustomerArea.classList.remove(...motionClasses, "no-transition");
      if (instant) {
        cashierCustomerArea.classList.add("no-transition");
      }
      if (state) {
        cashierCustomerArea.classList.add(state);
      }
      if (instant) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            cashierCustomerArea.classList.remove("no-transition");
          });
        });
      }
    }

    function resetCashierCustomerMotion() {
      setCustomerMotionState("is-at-counter", { instant: true });
    }

    function prepareCashierCustomerBehindDoors() {
      cashierCurrentOrder = pickCashierOrder();
      applyCustomerLook();
      renderCashierOrder();
      if (cashierCustomerOrder) {
        cashierCustomerOrder.classList.add("order-hidden");
      }
      setCustomerMotionState("is-behind-doors", { instant: true });
      setCashierDoorsOpen(false);
    }

    async function runCashierCustomerEnterSequence(alreadyBusy) {
      if (!cashierCustomerArea || !cashierGlassDoors) {
        spawnCashierCustomerInstant();
        return;
      }
      if (!alreadyBusy) {
        if (cashierSequenceBusy) return;
        setCashierBusy(true);
      }
      try {
        prepareCashierCustomerBehindDoors();
        await waitMs(120);
        setCashierDoorsOpen(true);
        await waitMs(CASHIER_DOOR_MS);
        setCustomerMotionState("is-walking-to-counter");
        await waitCustomerAreaTransition(CASHIER_WALK_MS);
        setCustomerMotionState("is-at-counter");
        await waitMs(CASHIER_DOOR_MS);
        setCashierDoorsOpen(false);
        if (cashierCustomerOrder) {
          cashierCustomerOrder.classList.remove("order-hidden");
        }
        updateCashierUI();
      } finally {
        setCashierBusy(false);
      }
    }

    function spawnCashierCustomerInstant() {
      cashierCurrentOrder = pickCashierOrder();
      applyCustomerLook();
      renderCashierOrder();
      resetCashierCustomerMotion();
      if (cashierCustomerOrder) {
        cashierCustomerOrder.classList.remove("order-hidden");
      }
      updateCashierUI();
    }

    function spawnCashierCustomer() {
      runCashierCustomerEnterSequence();
    }

    function setCashierBusy(busy) {
      cashierSequenceBusy = busy;
      if (screen5) {
        screen5.classList.toggle("cashier-busy", busy);
      }
    }

    function releaseStuckUI() {
      hideTrayActionMenu();
      closeTrayCloseup();
      trayDragState = null;
      window.removeEventListener("pointermove", onTrayDragMove);
      window.removeEventListener("pointerup", endTrayDrag);
      window.removeEventListener("pointercancel", endTrayDrag);
      if (trayDragGhost) {
        trayDragGhost.hidden = true;
        trayDragGhost.innerHTML = "";
      }
      setCashierBusy(false);
    }

    function clearCustomerCarryTray() {
      if (cashierCustomerTrayGrid) {
        cashierCustomerTrayGrid.innerHTML = "";
      }
      if (cashierCustomer) {
        cashierCustomer.classList.remove("has-carry-tray");
      }
    }

    function buildCustomerCarryTray() {
      if (!cashierCustomerTrayGrid) return;
      cashierCustomerTrayGrid.innerHTML = "";
      TRAY_SLOTS.forEach((slot) => {
        const entry = trayContents[slot];
        const cell = document.createElement("div");
        cell.className = "customer-carry-tray-cell";
        if (entry) {
          renderTrayEntryIcon(cell, entry);
        }
        cashierCustomerTrayGrid.appendChild(cell);
      });
      if (cashierCustomer) {
        cashierCustomer.classList.add("has-carry-tray");
      }
    }

    async function runCashierCustomerExitSequence() {
      if (!cashierCustomerArea || !cashierGlassDoors) {
        clearTrayContents();
        trayDirty = true;
        trayAtCashier = false;
        tray.classList.remove("cashier-away");
        spawnCashierCustomerInstant();
        updateCarrierUI();
        return;
      }

      setCashierBusy(true);
      try {
        if (cashierCustomerOrder) {
          cashierCustomerOrder.classList.add("order-hidden");
        }

        buildCustomerCarryTray();
        clearTrayContents();
        trayDirty = true;
        trayAtCashier = false;
        tray.classList.remove("cashier-away");
        updateCashierUI();
        updateCarrierUI();

        showCashierToast("success", "Perfect order!");

        setCashierDoorsOpen(true);
        await waitMs(CASHIER_DOOR_MS);
        setCustomerMotionState("is-exiting-through-door");
        await waitCustomerAreaTransition(CASHIER_EXIT_MS);
        clearCustomerCarryTray();
        setCashierDoorsOpen(false);
        await waitMs(180);
        await runCashierCustomerEnterSequence(true);
      } finally {
        setCashierBusy(false);
      }
    }

    function finishCashierOrder() {
      if (cashierSequenceBusy) return;
      runCashierCustomerExitSequence();
    }

    function renderCashierTrayPreview() {
      cashierTrayPreview.innerHTML = "";
      if (!trayAtCashier) {
        cashierTrayPreview.setAttribute("aria-hidden", "true");
        return;
      }
      cashierTrayPreview.removeAttribute("aria-hidden");
      TRAY_SLOTS.forEach((slot) => {
        const entry = trayContents[slot];
        const cell = document.createElement("div");
        cell.className = "cashier-tray-preview-item";
        cell.dataset.slot = slot;
        if (entry) {
          renderTrayEntryIcon(cell, entry);
        }
        cashierTrayPreview.appendChild(cell);
      });
    }

    function syncTrayCashierAway() {
      tray.classList.toggle("cashier-away", trayAtCashier && !trayFollowing);
    }

    function placeTrayOnCashierSpot() {
      if (cashierSequenceBusy) return;
      if (!isScreen5Active() || !trayFollowing || trayAtCashier) return;
      if (trayDirty) {
        showCashierToast("error", "Wash the tray in the dishwasher first!");
        return;
      }
      if (!trayMeetsCashierMinimum()) {
        showCashierToast("error", "Need a drink AND food or soup!");
        return;
      }
      trayFollowing = false;
      tray.classList.remove("following");
      tray.style.left = "";
      tray.style.top = "";
      trayAtCashier = true;
      syncTrayCashierAway();
      if (trayMatchesCashierOrder(cashierCurrentOrder)) {
        finishCashierOrder();
      } else {
        showCashierToast("error", "Wrong order — check what they asked for!");
      }
      updateCashierUI();
      updateCarrierUI();
    }

    function pickUpTrayFromCashierSpot() {
      if (cashierSequenceBusy) return;
      if (!trayAtCashier || !isScreen5Active()) return;
      trayAtCashier = false;
      syncTrayCashierAway();
      pickUpTray();
    }

    function handleCashierTraySpotClick() {
      if (trayAtCashier) {
        pickUpTrayFromCashierSpot();
        return;
      }
      if (trayFollowing) {
        placeTrayOnCashierSpot();
      }
    }

    function updateCashierUI() {
      if (!cashierTraySpot) return;
      const canPlace =
        isScreen5Active() && trayFollowing && trayMeetsCashierMinimum();
      cashierTraySpot.classList.toggle("can-place", canPlace);
      cashierTraySpot.classList.toggle("has-tray", trayAtCashier);
      renderCashierTrayPreview();
      syncTrayCashierAway();
      cashierTraySpot.setAttribute(
        "aria-label",
        trayAtCashier
          ? "Tray on counter — click to pick up"
          : canPlace
            ? "Place tray here"
            : trayFollowing
              ? "Tray needs a drink AND food or soup"
              : "Pick up a loaded tray to place here"
      );
    }

    function getActiveShaker() {
      if (saltFollowing) return "salt";
      if (pepperFollowing) return "pepper";
      return null;
    }

    function getSeasoningTargetKey(carrier, payload) {
      if (!payload) return null;
      if (carrier === "plate" && payload.crop && payload.state) {
        return "plate:" + payload.crop + ":" + payload.state;
      }
      if (carrier === "bowl") {
        if (payload.flour) return "bowl:flour";
        if (payload.dough) return "bowl:dough";
        if (payload.batter) return "bowl:batter";
        if (payload.mix) return "bowl:mix-" + payload.mix;
      }
      if (carrier === "pot" && payload.soup) {
        if (isFinishedSoupPrep(payload)) {
          if (payload.soup === "potatoes" && payload.mix === "carrots") {
            return "pot:potato-soup-prep";
          }
          if (payload.soup === "tomatoes" && payload.mix === "tomatoes") {
            return "pot:tomato-soup-prep";
          }
        }
        if (payload.stew) return "pot:" + payload.soup + ":stew";
        if (payload.cold) return "pot:" + payload.soup + ":cold";
        return "pot:" + payload.soup + ":hot";
      }
      if (carrier === "cup" && payload.drink) return "cup:" + payload.drink;
      return null;
    }

    function canApplySeasoning(carrier, payload, seasoning) {
      const key = getSeasoningTargetKey(carrier, payload);
      if (!key) return false;
      const rules = FOOD_SEASONING[key];
      if (!rules || !rules[seasoning]) return false;
      if (seasoning === "salt" && payload.salted) return false;
      if (seasoning === "pepper" && payload.peppered) return false;
      return true;
    }

    function applySeasoningToCarrier(carrier, seasoning) {
      if (carrier !== "pot" || !potContents) return;
      const next = { ...potContents };
      if (seasoning === "salt") next.salted = true;
      if (seasoning === "pepper") next.peppered = true;
      setPotSoup(next);
    }

    function moveShakerWithCursor(shakerEl, clientX, clientY) {
      shakerEl.style.left = clientX + "px";
      shakerEl.style.top = clientY + "px";
    }

    function returnSaltShaker() {
      if (!saltFollowing) return;
      saltFollowing = false;
      saltShaker.classList.remove("following");
      saltShaker.style.left = "";
      saltShaker.style.top = "";
      saltShakerDock.classList.remove("is-empty");
      saltShaker.setAttribute("aria-label", "Pick up salt");
      updateCounterRestSpots();
    }

    function returnPepperShaker() {
      if (!pepperFollowing) return;
      pepperFollowing = false;
      pepperShaker.classList.remove("following");
      pepperShaker.style.left = "";
      pepperShaker.style.top = "";
      pepperShakerDock.classList.remove("is-empty");
      pepperShaker.setAttribute("aria-label", "Pick up pepper");
      updateCounterRestSpots();
    }

    function putDownShakers(except) {
      if (except !== "salt" && saltFollowing) returnSaltShaker();
      if (except !== "pepper" && pepperFollowing) returnPepperShaker();
    }

    function returnShakersIfNotOnScreen2() {
      if (!isScreen2Active()) putDownShakers();
    }

    function pickUpSalt() {
      if (!isScreen2Active() || saltFollowing) return;
      putDownShakers("salt");
      putDownOtherCarriers("salt");
      saltFollowing = true;
      saltShaker.classList.add("following");
      saltShakerDock.classList.add("is-empty");
      saltShaker.setAttribute("aria-label", "Salt — click dock to put down, or shake on counter food");
      moveShakerWithCursor(
        saltShaker,
        saltShaker.getBoundingClientRect().left,
        saltShaker.getBoundingClientRect().top
      );
      updateCounterRestSpots();
    }

    function pickUpPepper() {
      if (!isScreen2Active() || pepperFollowing) return;
      putDownShakers("pepper");
      putDownOtherCarriers("pepper");
      pepperFollowing = true;
      pepperShaker.classList.add("following");
      pepperShakerDock.classList.add("is-empty");
      pepperShaker.setAttribute("aria-label", "Pepper — click dock to put down, or shake on counter food");
      moveShakerWithCursor(
        pepperShaker,
        pepperShaker.getBoundingClientRect().left,
        pepperShaker.getBoundingClientRect().top
      );
      updateCounterRestSpots();
    }

    function playShakerShake(shakerEl) {
      shakerEl.classList.remove("shaking");
      void shakerEl.offsetWidth;
      shakerEl.classList.add("shaking");
      setTimeout(() => shakerEl.classList.remove("shaking"), 800);
    }

    function flashSeasoningOnCarrier(carrierEl, seasoning) {
      carrierEl.classList.remove("season-flash", "season-salt", "season-pepper");
      void carrierEl.offsetWidth;
      carrierEl.classList.add("season-flash", "season-" + seasoning);
      setTimeout(() => {
        carrierEl.classList.remove("season-flash", "season-salt", "season-pepper");
      }, 500);
    }

    function trySeasonCounterSpot(spotEl) {
      const seasoning = getActiveShaker();
      if (!seasoning || !isScreen2Active()) return false;
      if (!spotEl.dataset.spot.startsWith("s2-")) return false;
      const carrier = counterSpotOccupants.get(spotEl.dataset.spot);
      if (!carrier) return false;
      const payload = getCarrierPayload(carrier);
      if (!canApplySeasoning(carrier, payload, seasoning)) return false;
      const shakerEl = seasoning === "salt" ? saltShaker : pepperShaker;
      const carrierEl = getCarrierEl(carrier);
      playShakerShake(shakerEl);
      flashSeasoningOnCarrier(carrierEl, seasoning);
      applySeasoningToCarrier(carrier, seasoning);
      return true;
    }

    function trySeasonOnCounterCarrier(counterCarrier) {
      const seasoning = getActiveShaker();
      if (!seasoning || !isScreen2Active()) return false;
      const spotId = getCarrierRestSpotId(counterCarrier);
      if (!spotId || !spotId.startsWith("s2-")) return false;
      const payload = getCarrierPayload(counterCarrier);
      if (!canApplySeasoning(counterCarrier, payload, seasoning)) return false;
      const spotEl = getCounterSpotInActiveScreen(spotId);
      if (!spotEl) return false;
      return trySeasonCounterSpot(spotEl);
    }

    function updateCarrierUI() {
      updateFridgeSlots();
      updateTrashCan();
      updateSinkUI();
      updateDishwasherUI();
      updateCoolerUI();
      updateCuttingBoardUI();
      updateOvenUI();
      updateMicrowaveUI();
      updateBlenderUI();
      updateCounterRestSpots();
      updateDirtyCarrierVisuals();
      updateTrayVisual();
      updateCashierUI();
      updateTrayStackUI();
      returnShakersIfNotOnScreen2();
    }

    function getCarrierRestSpotId(carrier) {
      if (carrier === "plate") return plateRestSpotId;
      if (carrier === "cup") return cupRestSpotId;
      if (carrier === "pot") return potRestSpotId;
      if (carrier === "bowl") return bowlRestSpotId;
      if (carrier === "tray") return trayRestSpotId;
      return null;
    }

    function setCarrierRestSpotId(carrier, spotId) {
      if (carrier === "plate") plateRestSpotId = spotId;
      else if (carrier === "cup") cupRestSpotId = spotId;
      else if (carrier === "pot") potRestSpotId = spotId;
      else if (carrier === "bowl") bowlRestSpotId = spotId;
      else if (carrier === "tray") trayRestSpotId = spotId;
    }

    function getCarrierEl(carrier) {
      if (carrier === "plate") return plate;
      if (carrier === "cup") return cup;
      if (carrier === "pot") return pot;
      if (carrier === "bowl") return bowl;
      if (carrier === "tray") return tray;
      return null;
    }

    function getCarrierHome(carrier) {
      if (carrier === "plate") return plateHome;
      if (carrier === "cup") return cupHome;
      if (carrier === "pot") return potHome;
      if (carrier === "bowl") return bowlHome;
      if (carrier === "tray") return trayHome;
      return null;
    }

    function isCarrierFollowing(carrier) {
      if (carrier === "plate") return plateFollowing;
      if (carrier === "cup") return cupFollowing;
      if (carrier === "pot") return potFollowing;
      if (carrier === "bowl") return bowlFollowing;
      if (carrier === "tray") return trayFollowing;
      return false;
    }

    function clearCarrierRestSpot(carrier) {
      const spotId = getCarrierRestSpotId(carrier);
      if (spotId) counterSpotOccupants.delete(spotId);
      setCarrierRestSpotId(carrier, null);
    }

    function returnCarrierToHomeDock(carrier) {
      const el = getCarrierEl(carrier);
      const home = getCarrierHome(carrier);
      if (!el || !home) return;
      el.classList.remove("on-counter");
      el.style.position = "";
      el.style.left = "";
      el.style.top = "";
      el.style.transform = "";
      if (!isCarrierFollowing(carrier) && dishwasherLoad !== carrier) {
        home.classList.remove("is-empty");
      }
    }

    function getCounterSpotPadCenter(spotEl) {
      const r = spotEl.getBoundingClientRect();
      return {
        x: r.left + r.width / 2,
        y: r.bottom - 9,
      };
    }

    function carrierNeedsCounterReposition(carrier, spotEl) {
      const el = getCarrierEl(carrier);
      if (!el || !spotEl || !el.classList.contains("on-counter") || el.style.position !== "fixed") {
        return true;
      }
      const pad = getCounterSpotPadCenter(spotEl);
      const expectedLeft = pad.x - el.offsetWidth / 2;
      const expectedTop = pad.y - el.offsetHeight / 2;
      const left = parseFloat(el.style.left);
      const top = parseFloat(el.style.top);
      if (Number.isNaN(left) || Number.isNaN(top)) return true;
      const drift = 3;
      return Math.abs(left - expectedLeft) > drift || Math.abs(top - expectedTop) > drift;
    }

    function positionCarrierOnCounterSpot(carrier, spotEl) {
      const el = getCarrierEl(carrier);
      if (!el || !spotEl) return;
      if (!carrierNeedsCounterReposition(carrier, spotEl)) return;
      const pad = getCounterSpotPadCenter(spotEl);
      el.classList.add("on-counter");
      el.style.position = "fixed";
      el.style.left = pad.x - el.offsetWidth / 2 + "px";
      el.style.top = pad.y - el.offsetHeight / 2 + "px";
      el.style.transform = "scale(0.78)";
    }

    function getFollowingRestCarrier() {
      if (plateFollowing && !plateRestSpotId) return "plate";
      if (cupFollowing && !cupRestSpotId) return "cup";
      if (potFollowing && !potRestSpotId) return "pot";
      if (bowlFollowing && !bowlRestSpotId) return "bowl";
      if (trayFollowing && !trayRestSpotId) return "tray";
      return null;
    }

    function syncCounterRestForActiveScreen() {
      const active = document.querySelector(".screen.active");
      ["plate", "cup", "pot", "bowl", "tray"].forEach((carrier) => {
        const el = getCarrierEl(carrier);
        const spotId = getCarrierRestSpotId(carrier);
        if (!spotId || isCarrierFollowing(carrier) || dishwasherLoad === carrier) {
          el.classList.remove("counter-rest-away");
          return;
        }
        const spotEl = getCounterSpotInActiveScreen(spotId);
        if (spotEl) {
          el.classList.remove("counter-rest-away");
          positionCarrierOnCounterSpot(carrier, spotEl);
        } else {
          el.classList.add("counter-rest-away");
        }
      });
    }

    function updateCounterRestSpots() {
      const canPlace = getFollowingRestCarrier();
      const activeShaker = getActiveShaker();
      document.querySelectorAll(".counter-rest-spot").forEach((spot) => {
        const spotId = spot.dataset.spot;
        const occupied = counterSpotOccupants.has(spotId);
        const canCombine = canCounterCombineAtSpot(spotId);
        const onCarrier = occupied ? counterSpotOccupants.get(spotId) : null;
        const canSeason =
          !!activeShaker &&
          isScreen2Active() &&
          spotId.startsWith("s2-") &&
          occupied &&
          canApplySeasoning(onCarrier, getCarrierPayload(onCarrier), activeShaker);
        spot.classList.toggle("occupied", occupied);
        spot.classList.toggle("can-place", !!canPlace && !occupied);
        spot.classList.toggle("can-combine", canCombine);
        spot.classList.toggle("can-season", canSeason);
        spot.setAttribute(
          "aria-label",
          canSeason
            ? "Shake " + activeShaker + " on food here"
            : canCombine
              ? "Combine items here"
              : occupied
                ? "Counter spot (in use)"
                : canPlace
                  ? "Set item on counter"
                  : "Counter spot"
        );
      });
      syncCounterRestForActiveScreen();
    }

    function tryCombineOnCounterCarrier(counterCarrier) {
      const spotId = getCarrierRestSpotId(counterCarrier);
      if (!spotId || !getFollowingRestCarrier()) return false;
      if (!canCounterCombineAtSpot(spotId)) return false;
      const spotEl = getCounterSpotInActiveScreen(spotId);
      if (!spotEl) return false;
      return tryCounterCombine(spotEl);
    }

    function tryCounterCombine(spotEl) {
      const incoming = getFollowingRestCarrier();
      if (!incoming) return false;

      const spotId = spotEl.dataset.spot;
      let onCarrier = counterSpotOccupants.get(spotId);
      let withCarrier = incoming;
      if (!onCarrier) return false;

      let onPayload = getCarrierPayload(onCarrier);
      let withPayload = getCarrierPayload(withCarrier);
      if (!onPayload || !withPayload) return false;
      if (getCarrierDirty(onCarrier) || getCarrierDirty(withCarrier)) return false;

      let recipe = findCounterRecipe(onCarrier, onPayload, withCarrier, withPayload);
      if (!recipe) {
        recipe = findCounterRecipe(withCarrier, withPayload, onCarrier, onPayload);
        if (!recipe) return false;
        const swap = onCarrier;
        onCarrier = withCarrier;
        withCarrier = swap;
        onPayload = getCarrierPayload(onCarrier);
        withPayload = getCarrierPayload(withCarrier);
      }

      const resultCarrier = recipeResultCarrier(recipe, onCarrier, withCarrier);
      const otherCarrier = resultCarrier === onCarrier ? withCarrier : onCarrier;
      const prevOnSpot = counterSpotOccupants.get(spotId);
      const resultStaysOnSpot =
        resultCarrier === prevOnSpot &&
        getCarrierRestSpotId(resultCarrier) === spotId &&
        getCarrierEl(resultCarrier).classList.contains("on-counter");

      applyCarrierPayload(resultCarrier, recipe.result());
      clearCarrierPayload(otherCarrier);

      let shouldDirty = true;
      if (otherCarrier === onCarrier && recipe.dirtyOn === false) shouldDirty = false;
      if (otherCarrier === withCarrier && recipe.dirtyWith === false) shouldDirty = false;
      if (shouldDirty) setCarrierDirty(otherCarrier, true);

      stopCarrierFollowing(incoming);

      if (prevOnSpot && prevOnSpot !== resultCarrier) {
        setCarrierRestSpotId(prevOnSpot, null);
      }
      counterSpotOccupants.set(spotId, resultCarrier);
      setCarrierRestSpotId(resultCarrier, spotId);

      returnCarrierToHomeDock(otherCarrier);

      const resultEl = getCarrierEl(resultCarrier);
      resultEl.classList.remove("following");
      getCarrierHome(resultCarrier).classList.add("is-empty");
      resultEl.setAttribute("aria-label", "Pick up from counter");
      if (!resultStaysOnSpot) {
        positionCarrierOnCounterSpot(resultCarrier, spotEl);
      }

      flashCounterCombo(spotEl);
      updateCarrierUI();
      return true;
    }

    function restCarrierOnSpot(carrier, spotEl) {
      const spotId = spotEl.dataset.spot;
      if (counterSpotOccupants.has(spotId)) return;
      if (!isCarrierFollowing(carrier)) return;

      clearCarrierRestSpot(carrier);
      counterSpotOccupants.set(spotId, carrier);
      setCarrierRestSpotId(carrier, spotId);

      const el = getCarrierEl(carrier);
      const home = getCarrierHome(carrier);
      el.classList.remove("following");
      if (carrier === "plate") plateFollowing = false;
      else if (carrier === "cup") cupFollowing = false;
      else if (carrier === "pot") potFollowing = false;
      else if (carrier === "bowl") bowlFollowing = false;
      else if (carrier === "tray") trayFollowing = false;

      positionCarrierOnCounterSpot(carrier, spotEl);
      home.classList.add("is-empty");
      el.setAttribute(
        "aria-label",
        carrier === "tray"
          ? "Tray on counter — click for options"
          : "Pick up from counter"
      );
      requestAnimationFrame(() => {
        positionCarrierOnCounterSpot(carrier, spotEl);
        updateCarrierUI();
      });
    }

    function tryPlaceOnCounterSpot(spotEl) {
      const carrier = getFollowingRestCarrier();
      if (!carrier) return;
      if (counterSpotOccupants.has(spotEl.dataset.spot)) {
        if (counterSpotOccupants.get(spotEl.dataset.spot) === "tray") return;
        tryCounterCombine(spotEl);
        return;
      }
      restCarrierOnSpot(carrier, spotEl);
    }

    function liftCarrierFromCounterIfNeeded(carrier) {
      const spotId = getCarrierRestSpotId(carrier);
      if (!spotId) return false;
      clearCarrierRestSpot(carrier);
      const el = getCarrierEl(carrier);
      el.classList.remove("on-counter", "counter-rest-away");
      el.style.position = "";
      el.style.left = "";
      el.style.top = "";
      el.style.transform = "";
      return true;
    }

    function dockCarrierIfOnCounter(carrier) {
      if (!getCarrierRestSpotId(carrier)) return;
      liftCarrierFromCounterIfNeeded(carrier);
      returnCarrierToHomeDock(carrier);
    }

    function cloneTrayData(data) {
      return JSON.parse(JSON.stringify(data));
    }

    function isUnwashedTrayPayload(payload) {
      return !!payload && !!payload.crop && payload.state === "raw";
    }

    function isValidTrayPayload(payload) {
      if (!payload || isUnwashedTrayPayload(payload)) return false;
      if (isPotSoup(payload)) return true;
      if (isCupDrink(payload)) return true;
      if (isPlateFood(payload)) return true;
      if (isBowlItem(payload)) return true;
      return false;
    }

    function getTrayPreferredSlot(carrier) {
      const payload = getCarrierPayload(carrier);
      if (!payload || getCarrierDirty(carrier) || !isValidTrayPayload(payload)) return null;
      if (carrier === "pot" && isPotSoup(payload)) return "soup";
      if (carrier === "cup" && isCupDrink(payload)) return "drink";
      if (carrier === "plate" && isPlateFood(payload)) return "food";
      if (carrier === "bowl" && isBowlItem(payload)) return "extra";
      return null;
    }

    function canPlaceOnTraySlot(slot, carrier) {
      if (trayDirty) return false;
      const payload = getCarrierPayload(carrier);
      if (!payload || getCarrierDirty(carrier) || !isValidTrayPayload(payload)) return false;
      if (slot === "extra") return true;
      return getTrayPreferredSlot(carrier) === slot;
    }

    function carrierHasTrayFood(carrier) {
      if (carrier === "tray" || dishwasherLoad === carrier) return false;
      return getTrayPreferredSlot(carrier) !== null;
    }

    function carrierShowsInTrayCloseup(carrier) {
      return carrierHasTrayFood(carrier);
    }

    function hideTrayActionMenu() {
      if (!trayActionMenu) return;
      trayActionMenu.classList.remove("open");
      trayActionMenu.hidden = true;
    }

    function getCounterSpotInActiveScreen(spotId) {
      if (!spotId) return null;
      const active = document.querySelector(".screen.active");
      if (!active) return null;
      return active.querySelector('[data-spot="' + spotId + '"]');
    }

    function syncTrayCounterSpotIfNeeded() {
      if (trayRestSpotId) return;
      for (const [spotId, carrier] of counterSpotOccupants.entries()) {
        if (carrier === "tray") {
          trayRestSpotId = spotId;
          return;
        }
      }
    }

    function isTrayCloseupOpen() {
      return trayCloseup.classList.contains("is-open");
    }

    function isTrayOnCounter() {
      syncTrayCounterSpotIfNeeded();
      if (trayFollowing) return false;
      if (trayRestSpotId) return true;
      return tray.classList.contains("on-counter");
    }

    function showTrayActionMenu() {
      const r = tray.getBoundingClientRect();
      trayActionMenu.style.left = r.left + r.width / 2 + "px";
      trayActionMenu.style.top = r.top + "px";
      trayMenuPlaceFood.hidden = trayDirty;
      trayActionMenu.hidden = false;
      trayActionMenu.classList.add("open");
    }

    function renderTrayEntryIcon(el, entry) {
      if (!entry) {
        el.className = "tray-slot-drop";
        el.innerHTML = "";
        return;
      }
      const data = entry.data;
      el.className = "tray-slot-drop";
      el.innerHTML = "";
      const icon = document.createElement("div");
      if (isPotSoup(data)) setSoupIcon(icon, "tray-slot-item", data);
      else if (isCupDrink(data)) setDrinkIcon(icon, "tray-slot-item", data);
      else if (isPlateFood(data)) setFoodIcon(icon, "tray-slot-item", data);
      else if (isBowlItem(data)) setBowlIcon(icon, "tray-slot-item", data);
      else {
        el.className = "tray-slot-drop tray-extra-label";
        el.textContent = foodLabel(data) || bowlLabel(data) || "Item";
        return;
      }
      el.appendChild(icon);
    }

    function renderTraySlotIcon(el, slot, entry) {
      renderTrayEntryIcon(el, entry);
    }

    function updateTrayVisual() {
      let hasLoad = false;
      TRAY_SLOTS.forEach((slot) => {
        const loadEl = tray.querySelector('.tray-load[data-slot="' + slot + '"]');
        const entry = trayContents[slot];
        loadEl.classList.toggle("filled", !!entry);
        loadEl.innerHTML = "";
        if (entry) {
          hasLoad = true;
          const drop = document.createElement("div");
          renderTraySlotIcon(drop, slot, entry);
          loadEl.appendChild(drop);
        }
      });
      tray.classList.toggle("has-load", hasLoad);
    }

    function dockCarrierAfterTrayPlace(carrier) {
      if (isCarrierFollowing(carrier)) {
        if (carrier === "plate") putDownPlate();
        else if (carrier === "cup") putDownCup();
        else if (carrier === "pot") putDownPot();
        else if (carrier === "bowl") putDownBowl();
      } else if (getCarrierRestSpotId(carrier)) {
        liftCarrierFromCounterIfNeeded(carrier);
        returnCarrierToHomeDock(carrier);
        getCarrierHome(carrier).classList.remove("is-empty");
        getCarrierEl(carrier).setAttribute(
          "aria-label",
          carrier === "plate"
            ? "Pick up plate"
            : carrier === "cup"
              ? "Pick up cup"
              : carrier === "pot"
                ? "Pick up soup pot"
                : "Pick up bowl"
        );
      }
    }

    function placeOnTraySlot(slot, carrier) {
      if (!canPlaceOnTraySlot(slot, carrier)) return false;
      const payload = getCarrierPayload(carrier);
      if (!payload) return false;
      trayContents[slot] = { carrier, data: cloneTrayData(payload) };
      clearCarrierPayload(carrier);
      dockCarrierAfterTrayPlace(carrier);
      updateTrayVisual();
      return true;
    }

    function putDownCarriersNotInTrayCloseup() {
      if (basketFollowing) putDownBasket();
      if (plateFollowing && !carrierShowsInTrayCloseup("plate")) putDownPlate();
      if (cupFollowing && !carrierShowsInTrayCloseup("cup")) putDownCup();
      if (potFollowing && !carrierShowsInTrayCloseup("pot")) putDownPot();
      if (bowlFollowing && !carrierShowsInTrayCloseup("bowl")) putDownBowl();
      putDownShakers();
    }

    function buildTrayCloseupSources() {
      trayCloseupSources.innerHTML = "";
      ["pot", "cup", "plate", "bowl"].forEach((carrier) => {
        const preferred = getTrayPreferredSlot(carrier);
        const available = carrierShowsInTrayCloseup(carrier);
        const inHand = isCarrierFollowing(carrier);
        const wrap = document.createElement("div");
        wrap.className =
          "tray-source" +
          (carrier === "bowl" ? " bowl-source" : "") +
          (inHand ? " tray-source-in-hand" : "") +
          (available ? "" : " unavailable");
        wrap.dataset.carrier = carrier;
        const ring = document.createElement("div");
        ring.className = "tray-source-ring";
        const preview = document.createElement("div");
        preview.className = "tray-source-preview";
        if (available && preferred) {
          const payload = getCarrierPayload(carrier);
          if (payload) {
            const fake = document.createElement("div");
            renderTrayEntryIcon(fake, {
              carrier,
              data: cloneTrayData(payload),
            });
            preview.appendChild(fake);
          }
        }
        ring.appendChild(preview);
        const label = document.createElement("div");
        label.className = "tray-source-label";
        const names = { pot: "Soup pot", cup: "Cup", plate: "Plate", bowl: "Bowl" };
        label.textContent = names[carrier] + (inHand ? " (in hand)" : "");
        wrap.appendChild(ring);
        wrap.appendChild(label);
        if (available) {
          wrap.addEventListener("pointerdown", (e) => startTrayDragFromSource(carrier, e));
        }
        trayCloseupSources.appendChild(wrap);
      });
    }

    function renderTrayCloseupSlots() {
      trayCloseupSlots.querySelectorAll(".tray-slot").forEach((slotEl) => {
        const slot = slotEl.dataset.slot;
        const drop = slotEl.querySelector(".tray-slot-drop");
        const entry = trayContents[slot];
        slotEl.classList.toggle("filled", !!entry);
        renderTraySlotIcon(drop, slot, entry);
      });
    }

    let trayDragState = null;
    let trayDragGhost = null;

    function ensureTrayDragGhost() {
      if (trayDragGhost) return trayDragGhost;
      trayDragGhost = document.createElement("div");
      trayDragGhost.className = "tray-drag-ghost";
      trayDragGhost.hidden = true;
      document.body.appendChild(trayDragGhost);
      return trayDragGhost;
    }

    function moveTrayDragGhost(clientX, clientY) {
      if (!trayDragGhost) return;
      trayDragGhost.style.left = clientX + "px";
      trayDragGhost.style.top = clientY + "px";
    }

    function clearTrayDragHighlight() {
      trayCloseupSlots.querySelectorAll(".tray-slot").forEach((el) => {
        el.classList.remove("drag-over");
      });
    }

    function traySlotAtPoint(clientX, clientY) {
      const el = document.elementFromPoint(clientX, clientY);
      if (!el) return null;
      const slotEl = el.closest(".tray-slot");
      return slotEl ? slotEl.dataset.slot : null;
    }

    function startTrayDragFromSource(carrier, e) {
      if (!carrierShowsInTrayCloseup(carrier)) return;
      const preferred = getTrayPreferredSlot(carrier);
      if (!preferred) return;
      e.preventDefault();
      const ghost = ensureTrayDragGhost();
      ghost.innerHTML = "";
      const inner = document.createElement("div");
      renderTrayEntryIcon(inner, {
        carrier,
        data: cloneTrayData(getCarrierPayload(carrier)),
      });
      ghost.appendChild(inner);
      ghost.hidden = false;
      moveTrayDragGhost(e.clientX, e.clientY);
      trayDragState = { from: "source", carrier, preferred };
      window.addEventListener("pointermove", onTrayDragMove);
      window.addEventListener("pointerup", endTrayDrag);
      window.addEventListener("pointercancel", endTrayDrag);
    }

    function onTrayDragMove(e) {
      if (!trayDragState || !isTrayCloseupOpen()) return;
      moveTrayDragGhost(e.clientX, e.clientY);
      clearTrayDragHighlight();
      const over = traySlotAtPoint(e.clientX, e.clientY);
      if (
        over &&
        trayDragState.from === "source" &&
        canPlaceOnTraySlot(over, trayDragState.carrier)
      ) {
        const slotEl = trayCloseupSlots.querySelector('[data-slot="' + over + '"]');
        if (slotEl) slotEl.classList.add("drag-over");
      }
    }

    function endTrayDrag(e) {
      if (!trayDragState || !isTrayCloseupOpen()) return;
      const over = traySlotAtPoint(e.clientX, e.clientY);
      if (
        over &&
        trayDragState.from === "source" &&
        canPlaceOnTraySlot(over, trayDragState.carrier)
      ) {
        placeOnTraySlot(over, trayDragState.carrier);
        renderTrayCloseupSlots();
        buildTrayCloseupSources();
      }
      trayDragState = null;
      if (trayDragGhost) {
        trayDragGhost.hidden = true;
        trayDragGhost.innerHTML = "";
      }
      clearTrayDragHighlight();
      updateCarrierUI();
      window.removeEventListener("pointermove", onTrayDragMove);
      window.removeEventListener("pointerup", endTrayDrag);
      window.removeEventListener("pointercancel", endTrayDrag);
    }

    function openTrayCloseup() {
      syncTrayCounterSpotIfNeeded();
      if (trayDirty || trayFollowing || !isTrayOnCounter()) return;
      hideTrayActionMenu();
      putDownCarriersNotInTrayCloseup();
      trayCloseup.classList.add("is-open");
      trayCloseup.hidden = false;
      trayCloseup.removeAttribute("hidden");
      trayCloseup.setAttribute("aria-hidden", "false");
      try {
        buildTrayCloseupSources();
        renderTrayCloseupSlots();
      } catch (err) {
        console.error("tray closeup", err);
        closeTrayCloseup();
      }
    }

    function handleTrayPlaceFood(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      suppressTrayClickUntil = performance.now() + 500;
      openTrayCloseup();
    }

    function closeTrayCloseup() {
      if (!isTrayCloseupOpen()) return;
      trayCloseup.classList.remove("is-open");
      trayCloseup.hidden = true;
      trayCloseup.setAttribute("aria-hidden", "true");
      trayDragState = null;
      window.removeEventListener("pointermove", onTrayDragMove);
      window.removeEventListener("pointerup", endTrayDrag);
      window.removeEventListener("pointercancel", endTrayDrag);
      if (trayDragGhost) {
        trayDragGhost.hidden = true;
        trayDragGhost.innerHTML = "";
      }
      clearTrayDragHighlight();
      updateTrayVisual();
      updateCarrierUI();
    }

    function moveTrayWithCursor(clientX, clientY) {
      tray.style.left = clientX + 10 + "px";
      tray.style.top = clientY + 10 + "px";
    }

    function pickUpTray() {
      if (trayAtCashier) return;
      const onCounter = isTrayOnCounter();
      if (!onCounter && !isTrayOnHomeDock()) return;
      hideTrayActionMenu();
      closeTrayCloseup();
      liftCarrierFromCounterIfNeeded("tray");
      putDownOtherCarriers("tray");
      trayFollowing = true;
      tray.classList.add("following");
      tray.setAttribute(
        "aria-label",
        "Serving tray — click counter spot to set down, or click home ring"
      );
      moveTrayWithCursor(tray.getBoundingClientRect().left, tray.getBoundingClientRect().top);
      updateCarrierUI();
    }

    function putDownTray() {
      if (trayRestSpotId || trayAtCashier) return;
      if (!trayFollowing) return;
      hideTrayActionMenu();
      trayFollowing = false;
      tray.classList.remove("following");
      returnCarrierToHomeDock("tray");
      tray.setAttribute(
        "aria-label",
        traysAtHome > 0 ? "Pick up tray from stack" : "Pick up tray"
      );
      updateCarrierUI();
    }

    function updateDirtyCarrierVisuals() {
      const plateAway = dishwasherLoad === "plate";
      const cupAway = dishwasherLoad === "cup";
      const potAway = dishwasherLoad === "pot";
      const bowlAway = dishwasherLoad === "bowl";
      const trayAway = dishwasherLoad === "tray";
      const plateShowDirty = plateDirty && !plateAway;
      const cupShowDirty = cupDirty && !cupAway;
      const potShowDirty = potDirty && !potAway;
      const bowlShowDirty = bowlDirty && !bowlAway;
      const trayShowDirty = trayDirty && !trayAway;
      plate.classList.toggle("dirty", plateShowDirty);
      cup.classList.toggle("dirty", cupShowDirty);
      pot.classList.toggle("dirty", potShowDirty);
      bowl.classList.toggle("dirty", bowlShowDirty);
      tray.classList.toggle("dirty", trayShowDirty);
      plateHome.classList.toggle("carrier-in-appliance", plateAway);
      cupHome.classList.toggle("carrier-in-appliance", cupAway);
      potHome.classList.toggle("carrier-in-appliance", potAway);
      bowlHome.classList.toggle("carrier-in-appliance", bowlAway);
      trayHome.classList.toggle("carrier-in-appliance", trayAway);
      plateHome.classList.toggle("dirty-carrier", plateShowDirty && !plateFollowing);
      cupHome.classList.toggle("dirty-carrier", cupShowDirty && !cupFollowing);
      potHome.classList.toggle("dirty-carrier", potShowDirty && !potFollowing);
      bowlHome.classList.toggle("dirty-carrier", bowlShowDirty && !bowlFollowing);
      trayHome.classList.toggle("dirty-carrier", trayShowDirty && !trayFollowing);
    }

    function updateCuttingBoardUI() {
      const canCut =
        plateFollowing &&
        plateContents &&
        isCuttable(plateContents) &&
        !cuttingInProgress;
      kitchenCuttingBoard.classList.toggle("can-cut", canCut);
      kitchenCuttingBoard.classList.toggle("cutting", cuttingInProgress);

      if (cuttingInProgress && cuttingFood) {
        cuttingBoardFood.className =
          "cutting-board-food food-icon food-" + cuttingFood.crop;
        cuttingBoardFood.innerHTML = '<span class="food-shape" aria-hidden="true"></span>';
        cuttingBoardFood.removeAttribute("aria-hidden");
      } else {
        cuttingBoardFood.className = "cutting-board-food";
        cuttingBoardFood.innerHTML = "";
        cuttingBoardFood.setAttribute("aria-hidden", "true");
      }

      cuttingBoardZone.setAttribute(
        "aria-label",
        canCut
          ? "Cut food on board"
          : cuttingInProgress
            ? "Cutting…"
            : "Cutting board"
      );
    }

    function syncOvenFoodVisual() {
      const show = ovenBaking || ovenResult;
      kitchenOven.classList.toggle("has-oven-food", !!show);
      if (!show) {
        ovenFood.className = "oven-food";
        ovenFood.innerHTML = "";
        ovenFood.setAttribute("aria-hidden", "true");
        return;
      }
      ovenFood.removeAttribute("aria-hidden");
      if (ovenBaking && ovenBakingInput) {
        if (ovenBakingInput.kind === "dough") {
          ovenFood.className = "oven-food oven-food-baking";
          ovenFood.innerHTML = '<span class="oven-dough-ball" aria-hidden="true"></span>';
        } else {
          setFoodIcon(ovenFood, "oven-food oven-food-baking", ovenBakingInput.food);
        }
        return;
      }
      if (ovenResult) {
        setFoodIcon(ovenFood, "oven-food", ovenResult);
      }
    }

    function syncMicrowavePotVisual() {
      const show = microwaveHeating || microwaveResult;
      kitchenMicrowave.classList.toggle("has-microwave-soup", !!show);
      if (!show) {
        microwavePot.className = "microwave-pot";
        microwavePot.innerHTML = "";
        microwavePot.setAttribute("aria-hidden", "true");
        return;
      }
      microwavePot.removeAttribute("aria-hidden");
      const soupItem = microwaveHeating ? microwaveHeatingSoup : microwaveResult;
      if (!soupItem) return;
      microwavePot.className = "microwave-pot slot-icon-wrap soup-icon";
      microwavePot.innerHTML =
        miniPotHtml(soupItem.soup, microwaveHeating && isPotSoupCold(soupItem)) +
        '<span class="item-label">' +
        soupLabel(soupItem) +
        "</span>";
    }

    function updateMicrowaveUI() {
      const mwOpen = kitchenMicrowave.classList.contains("open");
      const canMicrowavePot =
        isPotSoupCold(potContents) && isPotSoupReadyForMicrowave(potContents);
      const canDrop =
        mwOpen &&
        !microwaveHeating &&
        !microwaveResult &&
        potFollowing &&
        canMicrowavePot &&
        !potDirty;
      const canTake =
        mwOpen &&
        !microwaveHeating &&
        !!microwaveResult &&
        potFollowing &&
        !potContents &&
        !potDirty;
      kitchenMicrowave.classList.toggle("can-drop", canDrop);
      kitchenMicrowave.classList.toggle("can-take", canTake);
      kitchenMicrowave.classList.toggle("heating", microwaveHeating);
      syncMicrowavePotVisual();
      microwaveZone.setAttribute(
        "aria-label",
        canDrop
          ? "Put seasoned cold soup pot in microwave"
          : potFollowing && isPotSoupCold(potContents) && !isPotSoupReadyForMicrowave(potContents)
            ? isFinishedSoupPrep(potContents) && !isPotSoupSeasonedForMicrowave(potContents)
              ? "Microwave — add salt and pepper on Kitchen 1 counter first"
              : "Microwave — potato/tomato soup needs chopped veggies combined on counter first"
            : canTake
            ? "Take hot soup pot out"
            : microwaveHeating
              ? "Heating soup…"
              : microwaveResult
                ? "Microwave — use an empty soup pot"
                : "Microwave"
      );
    }

    function updateOvenUI() {
      const ovenOpen = kitchenOven.classList.contains("open");
      const canDrop =
        ovenOpen &&
        !ovenBaking &&
        !ovenResult &&
        ((plateFollowing && isOvenPlateInput(plateContents) && !plateDirty) ||
          (bowlFollowing && isBowlDough(bowlContents) && !bowlDirty));
      const canTake =
        ovenOpen &&
        !ovenBaking &&
        !!ovenResult &&
        plateFollowing &&
        !plateContents &&
        !plateDirty;
      kitchenOven.classList.toggle("can-drop", canDrop);
      kitchenOven.classList.toggle("can-take", canTake);
      kitchenOven.classList.toggle("baking", ovenBaking);
      syncOvenFoodVisual();
      ovenZone.setAttribute(
        "aria-label",
        canDrop
          ? "Put food in oven"
          : ovenOpen &&
              !ovenBaking &&
              !ovenResult &&
              plateFollowing &&
              needsPineappleChopForOven(plateContents) &&
              !plateDirty
            ? "Oven — chop pineapple on cutting board first"
            : canTake
              ? "Take baked food on plate"
              : ovenBaking
                ? "Baking…"
                : ovenResult
                  ? "Oven — use an empty plate"
                  : "Oven"
      );
    }

    function updateCoolerUI() {
      const coolerOpen = kitchenCooler.classList.contains("open");
      const canFillCup = coolerOpen && cupFollowing && !cupContents && !cupDirty;
      kitchenCooler.classList.toggle("has-fillable-drinks", canFillCup);
      coolerDrinks.forEach((drinkEl) => {
        drinkEl.classList.toggle("can-fill", canFillCup);
      });
    }

    function updateBlenderUI() {
      const blenderJarFree =
        !blenderResult || blenderResult.type === "wheat";
      const canDropFood =
        plateFollowing &&
        plateContents &&
        isBlenderInput(plateContents) &&
        blenderJarFree &&
        !blenderBlending;
      const canFillCup =
        cupFollowing &&
        !cupContents &&
        !cupDirty &&
        blenderResult &&
        blenderResult.type === "juice" &&
        !blenderBlending;
      const canFillPot =
        potFollowing &&
        !potContents &&
        !potDirty &&
        blenderResult &&
        blenderResult.type === "soup" &&
        !blenderBlending;
      const canFillBowl =
        bowlFollowing &&
        !bowlContents &&
        !bowlDirty &&
        blenderResult &&
        blenderResult.type === "wheat" &&
        !blenderBlending;

      kitchenBlender.classList.toggle("can-drop-food", canDropFood);
      kitchenBlender.classList.toggle("can-fill-cup", canFillCup);
      kitchenBlender.classList.toggle("can-fill-pot", canFillPot);
      kitchenBlender.classList.toggle("can-fill-bowl", canFillBowl);
      kitchenBlender.classList.toggle("blending", blenderBlending);

      clearBlenderJarClasses();
      if (blenderBlending && blenderFruitFood) {
        blenderJar.classList.add("has-fruit");
        blenderFruit.className = "blender-fruit food-icon food-" + blenderFruitFood.crop;
        blenderFruit.innerHTML = '<span class="food-shape" aria-hidden="true"></span>';
        blenderFruit.removeAttribute("aria-hidden");
      } else if (blenderResult) {
        blenderJar.classList.add("has-juice");
        if (blenderResult.type === "juice") {
          const juiceClass = blenderResult.drink.replace("juice-", "");
          blenderJar.classList.add("juice-" + juiceClass);
        } else if (blenderResult.type === "soup") {
          blenderJar.classList.add("soup-" + blenderResult.crop);
        } else if (blenderResult.type === "wheat") {
          blenderJar.classList.add("blend-wheat");
        }
        blenderFruit.className = "blender-fruit";
        blenderFruit.setAttribute("aria-hidden", "true");
      } else {
        blenderFruit.className = "blender-fruit";
        blenderFruit.setAttribute("aria-hidden", "true");
      }

      blenderZone.setAttribute(
        "aria-label",
        canDropFood
          ? "Put food in blender"
          : canFillCup
            ? "Pour juice into cup"
            : canFillPot
              ? "Scoop soup into pot"
              : canFillBowl
                ? "Pour flour into bowl"
                : blenderBlending
                  ? "Blending…"
                  : blenderResult
                    ? "Blender — ready to scoop"
                    : "Blender"
      );
    }

    function moveBasketWithCursor(clientX, clientY) {
      basket.style.left = clientX + 14 + "px";
      basket.style.top = clientY + 14 + "px";
    }

    function movePlateWithCursor(clientX, clientY) {
      plate.style.left = clientX + 14 + "px";
      plate.style.top = clientY + 14 + "px";
    }

    function moveCupWithCursor(clientX, clientY) {
      cup.style.left = clientX + 14 + "px";
      cup.style.top = clientY + 14 + "px";
    }

    function movePotWithCursor(clientX, clientY) {
      pot.style.left = clientX + 14 + "px";
      pot.style.top = clientY + 14 + "px";
    }

    function moveBowlWithCursor(clientX, clientY) {
      bowl.style.left = clientX + 14 + "px";
      bowl.style.top = clientY + 14 + "px";
    }

    function putDownOtherCarriers(except) {
      if (except !== "basket" && basketFollowing) putDownBasket();
      if (except !== "plate" && plateFollowing) putDownPlate();
      if (except !== "cup" && cupFollowing) putDownCup();
      if (except !== "pot" && potFollowing) putDownPot();
      if (except !== "bowl" && bowlFollowing) putDownBowl();
      if (except !== "tray" && trayFollowing) putDownTray();
      putDownShakers(except);
    }

    function pickUpBasket() {
      putDownOtherCarriers("basket");
      basketFollowing = true;
      basket.classList.add("following");
      basketHome.classList.add("is-empty");
      gardenRow.classList.add("basket-ready");
      basket.setAttribute("aria-label", "Basket — click again to put down, or click a plant");
      moveBasketWithCursor(
        basket.getBoundingClientRect().left,
        basket.getBoundingClientRect().top
      );
      updateCarrierUI();
    }

    function putDownBasket() {
      basketFollowing = false;
      basket.classList.remove("following");
      basketHome.classList.remove("is-empty");
      gardenRow.classList.remove("basket-ready");
      basket.style.left = "";
      basket.style.top = "";
      basket.setAttribute("aria-label", "Pick up basket");
      updateCarrierUI();
    }

    function pickUpPlate() {
      if (dishwasherLoad === "plate") return;
      liftCarrierFromCounterIfNeeded("plate");
      putDownOtherCarriers("plate");
      plateFollowing = true;
      plate.classList.add("following");
      plateHome.classList.add("is-empty");
      if (plateDirty) {
        plate.setAttribute(
          "aria-label",
          "Dirty plate — click again to put down, or load in dishwasher"
        );
      } else {
        plate.setAttribute(
          "aria-label",
          plateContents
            ? needsPineappleChopForOven(plateContents)
              ? "Plate with washed pineapple — chop on cutting board before oven, or blender / sink / fridge / trash"
              : isBakedFood(plateContents)
                ? "Plate with " +
                  foodLabel(plateContents) +
                  " — fridge / trash only (already baked)"
                : "Plate — click again to put down, or use sink / fridge / trash / cutting board / blender / oven"
            : "Plate — click again to put down, or take clean food from sink, or take baked food from oven"
        );
      }
      movePlateWithCursor(
        plate.getBoundingClientRect().left,
        plate.getBoundingClientRect().top
      );
      updateCarrierUI();
    }

    function putDownPlate() {
      if (plateRestSpotId) return;
      plateFollowing = false;
      plate.classList.remove("following");
      returnCarrierToHomeDock("plate");
      plate.setAttribute("aria-label", "Pick up plate");
      updateCarrierUI();
    }

    function clearPlate() {
      plateContents = null;
      setFoodIcon(plateItem, "plate-item", null);
      plate.classList.remove("has-item", "plate-food");
      updateCarrierUI();
    }

    function setPlateFood(food) {
      if (!isPlateFood(food) || plateDirty) return;
      plateContents = food;
      setFoodIcon(plateItem, "plate-item", food);
      plate.classList.add("has-item", "plate-food");
      updateCarrierUI();
    }

    function pickUpCup() {
      if (dishwasherLoad === "cup") return;
      liftCarrierFromCounterIfNeeded("cup");
      putDownOtherCarriers("cup");
      cupFollowing = true;
      cup.classList.add("following");
      cupHome.classList.add("is-empty");
      if (cupDirty) {
        cup.setAttribute(
          "aria-label",
          "Dirty cup — click again to put down, or load in dishwasher"
        );
      } else {
        cup.setAttribute(
          "aria-label",
          cupContents
            ? "Cup — click again to put down, or use fridge / trash / blender"
            : "Cup — click again to put down, or fill from cooler or blender"
        );
      }
      moveCupWithCursor(
        cup.getBoundingClientRect().left,
        cup.getBoundingClientRect().top
      );
      updateCarrierUI();
    }

    function putDownCup() {
      if (cupRestSpotId) return;
      cupFollowing = false;
      cup.classList.remove("following");
      returnCarrierToHomeDock("cup");
      cup.setAttribute("aria-label", "Pick up cup");
      updateCarrierUI();
    }

    function clearCup() {
      cupContents = null;
      cupItem.textContent = "";
      cup.classList.remove("has-item");
      clearCupDrinkClasses();
      updateCarrierUI();
    }

    function setCupDrink(drink) {
      if (!isCupDrink(drink) || cupDirty) return;
      cupContents = drink;
      cup.classList.add("has-item");
      clearCupDrinkClasses();
      cup.classList.add("drink-" + drink.drink);
      updateCarrierUI();
    }

    function fillCupFromCooler(drinkEl) {
      if (!kitchenCooler.classList.contains("open")) return;
      if (!cupFollowing || cupContents || cupDirty) return;
      setCupDrink(makeDrink(drinkEl.dataset.drink));
    }

    function pickUpPot() {
      if (dishwasherLoad === "pot") return;
      liftCarrierFromCounterIfNeeded("pot");
      putDownOtherCarriers("pot");
      potFollowing = true;
      pot.classList.add("following");
      potHome.classList.add("is-empty");
      if (potDirty) {
        pot.setAttribute(
          "aria-label",
          "Dirty soup pot — click again to put down, or load in dishwasher"
        );
      } else {
        pot.setAttribute(
          "aria-label",
          potContents
            ? isPotSoupCold(potContents)
              ? isPotSoupReadyForMicrowave(potContents)
                ? "Soup pot with seasoned cold " +
                  (SOUP_LABELS[potContents.soup] || potContents.soup).toLowerCase() +
                  " — microwave in Kitchen 2, or fridge / trash"
                : isFinishedSoupPrep(potContents)
                  ? "Soup pot — Kitchen 1: salt + pepper on counter, then microwave"
                  : (potContents.soup === "potatoes" || potContents.soup === "tomatoes")
                    ? "Soup pot — add chopped veggies on counter, then salt + pepper, then microwave"
                    : "Soup pot with cold " +
                      (SOUP_LABELS[potContents.soup] || potContents.soup).toLowerCase() +
                      " — Kitchen 1: salt + pepper on counter first, then microwave"
              : "Soup pot — click again to put down, or use fridge / trash / blender"
            : "Soup pot — click again to put down, or scoop blended veggies"
        );
      }
      movePotWithCursor(pot.getBoundingClientRect().left, pot.getBoundingClientRect().top);
      updateCarrierUI();
    }

    function putDownPot() {
      if (potRestSpotId) return;
      potFollowing = false;
      pot.classList.remove("following");
      returnCarrierToHomeDock("pot");
      pot.setAttribute("aria-label", "Pick up soup pot");
      updateCarrierUI();
    }

    function clearPot() {
      potContents = null;
      pot.classList.remove("has-item", "stew");
      clearPotSoupClasses();
      updateCarrierUI();
    }

    function setPotSoup(soupItem) {
      if (!isPotSoup(soupItem) || potDirty) return;
      potContents = soupItem;
      pot.classList.add("has-item");
      clearPotSoupClasses();
      pot.classList.add("soup-" + soupItem.soup);
      pot.classList.toggle("stew", !!soupItem.stew);
      pot.classList.toggle("soup-cold", isPotSoupCold(soupItem));
      updateCarrierUI();
    }

    function pickUpBowl() {
      if (dishwasherLoad === "bowl") return;
      liftCarrierFromCounterIfNeeded("bowl");
      putDownOtherCarriers("bowl");
      bowlFollowing = true;
      bowl.classList.add("following");
      bowlHome.classList.add("is-empty");
      if (bowlDirty) {
        bowl.setAttribute(
          "aria-label",
          "Dirty bowl — click again to put down, or load in dishwasher"
        );
      } else {
        bowl.setAttribute(
          "aria-label",
          bowlContents
            ? "Bowl with " + bowlLabel(bowlContents).toLowerCase() + " — click again to put down, or use fridge / trash"
            : "Bowl — click again to put down, or pour flour from blender"
        );
      }
      moveBowlWithCursor(bowl.getBoundingClientRect().left, bowl.getBoundingClientRect().top);
      updateCarrierUI();
    }

    function putDownBowl() {
      if (bowlRestSpotId) return;
      bowlFollowing = false;
      bowl.classList.remove("following");
      returnCarrierToHomeDock("bowl");
      bowl.setAttribute("aria-label", "Pick up bowl");
      updateCarrierUI();
    }

    function clearBowl() {
      bowlContents = null;
      bowl.classList.remove("has-item");
      clearBowlFillClasses();
      updateCarrierUI();
    }

    function setBowlItem(item) {
      if (item && !isBowlItem(item)) return;
      if (bowlDirty && item) return;
      bowlContents = item;
      if (!item) {
        clearBowl();
        return;
      }
      bowl.classList.add("has-item");
      syncBowlVisual();
      updateCarrierUI();
    }

    function setBowlFlour(flourItem) {
      setBowlItem(flourItem);
    }

    function clearBasket() {
      basketContents = null;
      setFoodIcon(basketItem, "basket-item", null);
      basket.classList.remove("has-item");
      updateCarrierUI();
    }

    function setBasketFood(food) {
      if (!isBasketFood(food)) return;
      basketContents = food;
      setFoodIcon(basketItem, "basket-item", food);
      basket.classList.add("has-item");
      updateCarrierUI();
    }

    function setBasketCrop(crop) {
      setBasketFood(makeFood(crop, "raw"));
    }

    function updateSinkUI() {
      const canDrop =
        basketFollowing &&
        basketContents &&
        isBasketFood(basketContents) &&
        !isCupDrink(basketContents) &&
        !sinkContents &&
        !sinkWashing;
      const canTakePlate =
        plateFollowing &&
        !plateContents &&
        !plateDirty &&
        sinkContents &&
        !sinkWashing &&
        isPlateFood(sinkContents);

      kitchenSink.classList.toggle("can-drop", canDrop);
      kitchenSink.classList.toggle("can-take-plate", canTakePlate);
      kitchenSink.classList.toggle("washing", sinkWashing);

      if (sinkContents) {
        setFoodIcon(sinkItem, "sink-item", sinkContents);
        sinkItem.classList.add("visible");
        sinkItem.removeAttribute("aria-hidden");
        sinkSparkle.classList.toggle("show", isPlateFood(sinkContents));
      } else {
        setFoodIcon(sinkItem, "sink-item", null);
        sinkItem.classList.remove("visible");
        sinkItem.setAttribute("aria-hidden", "true");
        sinkSparkle.classList.remove("show");
      }

      sinkBasin.setAttribute(
        "aria-label",
        canDrop
          ? "Put food in sink to wash"
          : canTakePlate
            ? "Take clean food onto plate"
            : sinkWashing
              ? "Washing…"
              : "Sink"
      );
    }

    function startSinkWashTimer() {
      let remaining = SINK_WASH_SEC;
      sinkWashTimer.hidden = false;
      sinkWashTimer.textContent = remaining;
      sinkTimerInterval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(sinkTimerInterval);
          sinkTimerInterval = null;
          sinkWashTimer.hidden = true;
          finishSinkWash();
        } else {
          sinkWashTimer.textContent = remaining;
        }
      }, 1000);
    }

    function finishSinkWash() {
      sinkWashing = false;
      if (sinkContents && isCupDrink(sinkContents)) {
        sinkContents = null;
        updateCarrierUI();
        return;
      }
      if (sinkContents) {
        sinkContents.state = "washed";
      }
      updateCarrierUI();
    }

    function placeInSink() {
      if (!basketFollowing || !basketContents || !isBasketFood(basketContents)) return;
      if (isCupDrink(basketContents)) return;
      if (sinkContents || sinkWashing) return;
      sinkContents = { ...basketContents };
      clearBasket();
      sinkWashing = true;
      updateCarrierUI();
      startSinkWashTimer();
    }

    function takeFromSink() {
      if (!plateFollowing || plateContents || plateDirty) return;
      if (!sinkContents || sinkWashing || !isPlateFood(sinkContents)) return;
      setPlateFood({ ...sinkContents });
      sinkContents = null;
      updateCarrierUI();
    }

    function clearSinkInstant() {
      if (sinkTimerInterval) {
        clearInterval(sinkTimerInterval);
        sinkTimerInterval = null;
      }
      sinkWashing = false;
      sinkContents = null;
      sinkWashTimer.hidden = true;
      updateSinkUI();
    }

    function updateTrashCan() {
      kitchenTrashCans.forEach((trash) => {
        const canThrow =
          (basketContents && isBasketFood(basketContents)) ||
          (plateContents && isPlateFood(plateContents)) ||
          (cupContents && isCupDrink(cupContents)) ||
          (potContents && isPotSoup(potContents)) ||
          (bowlContents && isBowlItem(bowlContents)) ||
          trayCanThrowAway();
        trash.classList.toggle("can-throw", canThrow);
        trash.disabled = !canThrow;
        trash.setAttribute(
          "aria-label",
          canThrow
            ? trayCanThrowAway() && !basketContents && !plateContents && !cupContents && !potContents && !bowlContents
              ? "Throw away tray food"
              : "Throw away food or drink"
            : "Trash can"
        );
      });
    }

    function updateDishwasherUI() {
      const dishwasherOpen = kitchenDishwasher.classList.contains("open");
      const canDropPlate =
        dishwasherOpen &&
        plateFollowing &&
        plateDirty &&
        !plateContents &&
        !dishwasherLoad &&
        !dishwasherWashing;
      const canDropCup =
        dishwasherOpen &&
        cupFollowing &&
        cupDirty &&
        !cupContents &&
        !dishwasherLoad &&
        !dishwasherWashing;
      const canDropPot =
        dishwasherOpen &&
        potFollowing &&
        potDirty &&
        !potContents &&
        !dishwasherLoad &&
        !dishwasherWashing;
      const canDropBowl =
        dishwasherOpen &&
        bowlFollowing &&
        bowlDirty &&
        !bowlContents &&
        !dishwasherLoad &&
        !dishwasherWashing;
      const canDropTray =
        dishwasherOpen &&
        trayDirty &&
        !trayHasLoad() &&
        !dishwasherLoad &&
        !dishwasherWashing &&
        (trayFollowing || isTrayOnHomeDock());
      const canDrop = canDropPlate || canDropCup || canDropPot || canDropBowl || canDropTray;

      kitchenDishwasher.classList.toggle("can-drop-dish", canDrop);
      kitchenDishwasher.classList.toggle("washing", dishwasherWashing);

      if (dishwasherLoad === "plate") {
        dishwasherItem.className = "dishwasher-item icon-dish-plate visible";
        dishwasherItem.innerHTML = "";
        dishwasherItem.removeAttribute("aria-hidden");
      } else if (dishwasherLoad === "cup") {
        dishwasherItem.className = "dishwasher-item icon-dish-cup visible";
        dishwasherItem.innerHTML = "";
        dishwasherItem.removeAttribute("aria-hidden");
      } else if (dishwasherLoad === "pot") {
        dishwasherItem.className = "dishwasher-item icon-dish-pot visible";
        dishwasherItem.innerHTML = "";
        dishwasherItem.removeAttribute("aria-hidden");
      } else if (dishwasherLoad === "bowl") {
        dishwasherItem.className = "dishwasher-item icon-dish-bowl visible";
        dishwasherItem.innerHTML = "";
        dishwasherItem.removeAttribute("aria-hidden");
      } else if (dishwasherLoad === "tray") {
        dishwasherItem.className = "dishwasher-item icon-dish-tray visible";
        dishwasherItem.innerHTML = "";
        dishwasherItem.removeAttribute("aria-hidden");
      } else {
        dishwasherItem.className = "dishwasher-item";
        dishwasherItem.innerHTML = "";
        dishwasherItem.setAttribute("aria-hidden", "true");
      }

      dishwasherZone.setAttribute(
        "aria-label",
        canDrop
          ? canDropTray
            ? "Load dirty tray in dishwasher"
            : "Load dirty dish in dishwasher"
          : dishwasherWashing
            ? "Dishwasher washing…"
            : dishwasherOpen &&
                trayDirty &&
                !trayHasLoad() &&
                !trayFollowing &&
                !isTrayOnHomeDock()
              ? "Dishwasher — pick up dirty tray first"
              : "Dishwasher"
      );
    }

    function startDishwasherWashTimer() {
      let remaining = DISHWASHER_WASH_SEC;
      dishwasherWashTimer.hidden = false;
      dishwasherWashTimer.textContent = remaining;
      dishwasherTimerInterval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(dishwasherTimerInterval);
          dishwasherTimerInterval = null;
          dishwasherWashTimer.hidden = true;
          finishDishwasherWash();
        } else {
          dishwasherWashTimer.textContent = remaining;
        }
      }, 1000);
    }

    function finishDishwasherWash() {
      dishwasherWashing = false;
      if (dishwasherLoad === "plate") {
        plateDirty = false;
      } else if (dishwasherLoad === "cup") {
        cupDirty = false;
      } else if (dishwasherLoad === "pot") {
        potDirty = false;
      } else if (dishwasherLoad === "bowl") {
        bowlDirty = false;
      } else if (dishwasherLoad === "tray") {
        trayDirty = false;
      }
      dishwasherLoad = null;
      updateCarrierUI();
    }

    function placeInDishwasher() {
      const dishwasherOpen = kitchenDishwasher.classList.contains("open");
      if (!dishwasherOpen || dishwasherLoad || dishwasherWashing) return;

      if (plateFollowing && plateDirty && !plateContents) {
        putDownPlate();
        dishwasherLoad = "plate";
        dishwasherWashing = true;
        updateCarrierUI();
        startDishwasherWashTimer();
      } else if (cupFollowing && cupDirty && !cupContents) {
        putDownCup();
        dishwasherLoad = "cup";
        dishwasherWashing = true;
        updateCarrierUI();
        startDishwasherWashTimer();
      } else if (potFollowing && potDirty && !potContents) {
        putDownPot();
        dishwasherLoad = "pot";
        dishwasherWashing = true;
        updateCarrierUI();
        startDishwasherWashTimer();
      } else if (bowlFollowing && bowlDirty && !bowlContents) {
        putDownBowl();
        dishwasherLoad = "bowl";
        dishwasherWashing = true;
        updateCarrierUI();
        startDishwasherWashTimer();
      } else if (trayDirty && !trayHasLoad()) {
        if (trayFollowing) {
          hideTrayActionMenu();
          trayFollowing = false;
          tray.classList.remove("following");
        } else if (!isTrayOnHomeDock()) {
          return;
        }
        clearCarrierRestSpot("tray");
        tray.classList.remove("on-counter");
        tray.style.position = "";
        tray.style.left = "";
        tray.style.top = "";
        tray.style.transform = "";
        dishwasherLoad = "tray";
        dishwasherWashing = true;
        updateCarrierUI();
        startDishwasherWashTimer();
      }
    }

    function startCuttingTimer() {
      let remaining = CUT_SEC;
      cuttingBoardTimer.hidden = false;
      cuttingBoardTimer.textContent = remaining;
      cuttingTimerInterval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(cuttingTimerInterval);
          cuttingTimerInterval = null;
          cuttingBoardTimer.hidden = true;
          finishCutting();
        } else {
          cuttingBoardTimer.textContent = remaining;
        }
      }, 1000);
    }

    function finishCutting() {
      cuttingInProgress = false;
      if (cuttingFood) {
        setPlateFood(makeFood(cuttingFood.crop, "cut"));
        cuttingFood = null;
      }
      updateCarrierUI();
    }

    function placeOnCuttingBoard() {
      if (!plateFollowing || !plateContents || !isCuttable(plateContents)) return;
      if (cuttingInProgress) return;
      cuttingFood = { crop: plateContents.crop };
      clearPlate();
      cuttingInProgress = true;
      updateCarrierUI();
      startCuttingTimer();
    }

    function clearCuttingInstant() {
      if (cuttingTimerInterval) {
        clearInterval(cuttingTimerInterval);
        cuttingTimerInterval = null;
      }
      cuttingBoardTimer.hidden = true;
      if (cuttingInProgress) {
        finishCutting();
      } else {
        updateCuttingBoardUI();
      }
    }

    function startOvenTimer() {
      let remaining = OVEN_BAKE_SEC;
      ovenTimer.hidden = false;
      ovenTimer.textContent = remaining;
      ovenTimerInterval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(ovenTimerInterval);
          ovenTimerInterval = null;
          ovenTimer.hidden = true;
          finishBaking();
        } else {
          ovenTimer.textContent = remaining;
        }
      }, 1000);
    }

    function finishBaking() {
      ovenBaking = false;
      ovenResult = bakeFoodFromInput(ovenBakingInput);
      ovenBakingInput = null;
      updateCarrierUI();
    }

    function placeInOven() {
      if (!kitchenOven.classList.contains("open")) return;
      if (ovenBaking || ovenResult) return;
      if (bowlFollowing && isBowlDough(bowlContents) && !bowlDirty) {
        ovenBakingInput = { kind: "dough" };
        clearBowl();
        ovenBaking = true;
        updateCarrierUI();
        startOvenTimer();
        return;
      }
      if (plateFollowing && isOvenPlateInput(plateContents) && !plateDirty) {
        ovenBakingInput = { kind: "food", food: { ...plateContents } };
        clearPlate();
        ovenBaking = true;
        updateCarrierUI();
        startOvenTimer();
      }
    }

    function takeFromOven() {
      if (!ovenResult || ovenBaking) return;
      if (!plateFollowing || plateContents || plateDirty) return;
      setPlateFood({ ...ovenResult });
      ovenResult = null;
      updateCarrierUI();
    }

    function clearOvenInstant() {
      if (ovenTimerInterval) {
        clearInterval(ovenTimerInterval);
        ovenTimerInterval = null;
      }
      ovenTimer.hidden = true;
      if (ovenBaking) {
        finishBaking();
      } else {
        updateOvenUI();
      }
    }

    function startMicrowaveTimer() {
      let remaining = MICROWAVE_HEAT_SEC;
      microwaveTimer.hidden = false;
      microwaveTimer.textContent = remaining;
      microwaveTimerInterval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(microwaveTimerInterval);
          microwaveTimerInterval = null;
          microwaveTimer.hidden = true;
          finishMicrowave();
        } else {
          microwaveTimer.textContent = remaining;
        }
      }, 1000);
    }

    function finishMicrowave() {
      microwaveHeating = false;
      if (microwaveHeatingSoup) {
        microwaveResult = heatPotSoup(microwaveHeatingSoup);
        microwaveHeatingSoup = null;
      }
      updateCarrierUI();
    }

    function placeInMicrowave() {
      if (!kitchenMicrowave.classList.contains("open")) return;
      if (microwaveHeating || microwaveResult) return;
      if (!potFollowing || !isPotSoupCold(potContents) || potDirty) return;
      if (!isPotSoupReadyForMicrowave(potContents)) return;
      microwaveHeatingSoup = { ...potContents };
      clearPot();
      microwaveHeating = true;
      updateCarrierUI();
      startMicrowaveTimer();
    }

    function takeFromMicrowave() {
      if (!microwaveResult || microwaveHeating) return;
      if (!potFollowing || potContents || potDirty) return;
      setPotSoup({ ...microwaveResult });
      microwaveResult = null;
      updateCarrierUI();
    }

    function clearMicrowaveInstant() {
      if (microwaveTimerInterval) {
        clearInterval(microwaveTimerInterval);
        microwaveTimerInterval = null;
      }
      microwaveTimer.hidden = true;
      if (microwaveHeating) {
        finishMicrowave();
      } else {
        updateMicrowaveUI();
      }
    }

    function clearDishwasherInstant() {
      if (dishwasherTimerInterval) {
        clearInterval(dishwasherTimerInterval);
        dishwasherTimerInterval = null;
      }
      dishwasherWashing = false;
      dishwasherLoad = null;
      dishwasherWashTimer.hidden = true;
      updateDishwasherUI();
      updateDirtyCarrierVisuals();
    }

    function startBlenderTimer() {
      let remaining = BLENDER_BLEND_SEC;
      blenderWashTimer.hidden = false;
      blenderWashTimer.textContent = remaining;
      blenderTimerInterval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(blenderTimerInterval);
          blenderTimerInterval = null;
          blenderWashTimer.hidden = true;
          finishBlender();
        } else {
          blenderWashTimer.textContent = remaining;
        }
      }, 1000);
    }

    function finishBlender() {
      blenderBlending = false;
      if (blenderFruitFood) {
        const crop = blenderFruitFood.crop;
        if (crop === "wheat") {
          blenderResult = { type: "wheat" };
        } else if (BLENDER_SOUP_CROPS.has(crop)) {
          blenderResult = { type: "soup", crop };
        } else {
          blenderResult = { type: "juice", drink: "juice-" + crop };
        }
        blenderFruitFood = null;
      }
      updateCarrierUI();
    }

    function placeInBlender() {
      if (!plateFollowing || !plateContents || !isBlenderInput(plateContents)) return;
      if (blenderBlending) return;
      if (blenderResult && blenderResult.type !== "wheat") return;
      blenderResult = null;
      blenderFruitFood = { crop: plateContents.crop };
      clearPlate();
      blenderBlending = true;
      updateCarrierUI();
      startBlenderTimer();
    }

    function takeJuiceFromBlender() {
      if (
        !cupFollowing ||
        cupContents ||
        cupDirty ||
        !blenderResult ||
        blenderResult.type !== "juice" ||
        blenderBlending
      ) {
        return;
      }
      setCupDrink(makeDrink(blenderResult.drink));
      blenderResult = null;
      updateCarrierUI();
    }

    function takeSoupFromBlender() {
      if (
        !potFollowing ||
        potContents ||
        potDirty ||
        !blenderResult ||
        blenderResult.type !== "soup" ||
        blenderBlending
      ) {
        return;
      }
      setPotSoup(makePotSoup(blenderResult.crop, true));
      blenderResult = null;
      updateCarrierUI();
    }

    function takeFlourFromBlender() {
      if (
        !bowlFollowing ||
        bowlContents ||
        bowlDirty ||
        !blenderResult ||
        blenderResult.type !== "wheat" ||
        blenderBlending
      ) {
        return;
      }
      setBowlFlour(makeBowlFlour());
      blenderResult = null;
      updateCarrierUI();
    }

    function clearBlenderInstant() {
      if (blenderTimerInterval) {
        clearInterval(blenderTimerInterval);
        blenderTimerInterval = null;
      }
      blenderWashTimer.hidden = true;
      if (blenderBlending) {
        finishBlender();
      } else {
        updateBlenderUI();
      }
    }

    function throwAwayFood(trashEl) {
      if (basketContents && isBasketFood(basketContents)) {
        trashEl.classList.add("throwing");
        clearBasket();
      } else if (plateContents && isPlateFood(plateContents)) {
        trashEl.classList.add("throwing");
        clearPlate();
        plateDirty = true;
        updateCarrierUI();
      } else if (cupContents && isCupDrink(cupContents)) {
        trashEl.classList.add("throwing");
        clearCup();
        cupDirty = true;
        updateCarrierUI();
      } else if (potContents && isPotSoup(potContents)) {
        trashEl.classList.add("throwing");
        clearPot();
        potDirty = true;
        updateCarrierUI();
      } else if (bowlContents && isBowlItem(bowlContents)) {
        trashEl.classList.add("throwing");
        clearBowl();
        bowlDirty = true;
        updateCarrierUI();
      } else if (trayCanThrowAway()) {
        trashEl.classList.add("throwing");
        throwAwayTrayFoodOnly();
      } else {
        return;
      }
      setTimeout(() => trashEl.classList.remove("throwing"), 350);
    }

    function canTakeBowlItemFromFridge() {
      if (basketContents || plateContents || cupContents || potContents || bowlContents) {
        return false;
      }
      if (bowlDirty || dishwasherLoad === "bowl") return false;
      return true;
    }

    function getFridgeItemKind(item) {
      if (!item) return null;
      if (isBasketFood(item)) return "basket";
      if (isPlateFood(item)) return "plate";
      if (isCupDrink(item)) return "cup";
      if (isPotSoup(item)) return "pot";
      if (isBowlItem(item)) return "bowl";
      return null;
    }

    /** Can this shelf item be picked up? Only the matching carrier must be free. */
    function canTakeItemFromFridge(item) {
      const kind = getFridgeItemKind(item);
      if (!kind) return false;
      if (kind === "basket") return !basketContents;
      if (kind === "plate") return !plateContents && !plateDirty;
      if (kind === "cup") return !cupContents && !cupDirty;
      if (kind === "pot") return !potContents && !potDirty;
      if (kind === "bowl") return canTakeBowlItemFromFridge();
      return false;
    }

    function isFridgeShelfInteractive() {
      return (
        kitchenFridge.classList.contains("open") &&
        !kitchenFridge.classList.contains("closing")
      );
    }

    function updateFridgeSlots() {
      const fridgeOpen = kitchenFridge.classList.contains("open");
      fridgeSlots.forEach((slot, i) => {
        const item = fridgeShelves[i];
        const heldBasket = basketContents && basketFollowing;
        const heldPlate = plateContents && plateFollowing;
        const heldCup = cupContents && cupFollowing;
        const heldPot = potContents && potFollowing;
        const heldBowl = bowlContents && bowlFollowing;
        const canDrop =
          fridgeOpen &&
          !item &&
          ((heldBasket && isBasketFood(basketContents)) ||
            (heldPlate && isPlateFood(plateContents) && !plateDirty) ||
            (heldCup && isCupDrink(cupContents) && !cupDirty) ||
            (heldPot && isPotSoup(potContents) && !potDirty) ||
            (heldBowl && isBowlItem(bowlContents) && !bowlDirty));
        const canTake = fridgeOpen && item && canTakeItemFromFridge(item);
        const blockedTake = fridgeOpen && item && !canTake;
        slot.classList.toggle("can-drop", canDrop);
        slot.classList.toggle("can-take", canTake);
        slot.classList.toggle("blocked-take", blockedTake);
        slot.classList.toggle("filled", !!item);
        slot.setAttribute(
          "aria-label",
          canTake
            ? "Take " + foodLabel(item) + " from shelf"
            : blockedTake
              ? "Can't take — " +
                (basketContents && getFridgeItemKind(item) === "basket"
                  ? "basket already has food"
                  : "hands full or need a clean dish")
              : canDrop
                ? "Put food on shelf"
                : item
                  ? "Shelf with food"
                  : "Empty shelf"
        );
      });
    }

    function placeOnShelf(index) {
      if (!isBasketFood(basketContents)) return;
      const slot = fridgeSlots[index];
      fridgeShelves[index] = { ...basketContents };
      setFoodIcon(slot.querySelector(".fridge-slot-item"), "fridge-slot-item", basketContents);
      slot.classList.add("filled");
      clearBasket();
    }

    function takeFromShelf(index) {
      const item = fridgeShelves[index];
      if (!item || !canTakeItemFromFridge(item)) return;
      setBasketFood({ ...item });
      fridgeShelves[index] = null;
      setFoodIcon(fridgeSlots[index].querySelector(".fridge-slot-item"), "fridge-slot-item", null);
      fridgeSlots[index].classList.remove("filled");
      if (!basketFollowing) pickUpBasket();
      updateFridgeSlots();
    }

    function placeOnShelfPlate(index) {
      if (!isPlateFood(plateContents)) return;
      const slot = fridgeSlots[index];
      fridgeShelves[index] = { ...plateContents };
      setFoodIcon(slot.querySelector(".fridge-slot-item"), "fridge-slot-item", plateContents);
      slot.classList.add("filled");
      clearPlate();
    }

    function takeFromShelfPlate(index) {
      const item = fridgeShelves[index];
      if (!item || !canTakeItemFromFridge(item)) return;
      dockCarrierIfOnCounter("plate");
      if (plateDirty) {
        plateDirty = false;
        plate.classList.remove("dirty");
      }
      setPlateFood({ ...item });
      fridgeShelves[index] = null;
      setFoodIcon(fridgeSlots[index].querySelector(".fridge-slot-item"), "fridge-slot-item", null);
      fridgeSlots[index].classList.remove("filled");
      if (!plateFollowing) pickUpPlate();
      updateFridgeSlots();
    }

    function placeOnShelfCup(index) {
      if (!isCupDrink(cupContents)) return;
      const slot = fridgeSlots[index];
      fridgeShelves[index] = { ...cupContents };
      setDrinkIcon(slot.querySelector(".fridge-slot-item"), "fridge-slot-item", cupContents);
      slot.classList.add("filled");
      clearCup();
    }

    function takeFromShelfCup(index) {
      const item = fridgeShelves[index];
      if (!item || !canTakeItemFromFridge(item)) return;
      dockCarrierIfOnCounter("cup");
      if (cupDirty) {
        cupDirty = false;
        cup.classList.remove("dirty");
      }
      setCupDrink({ ...item });
      fridgeShelves[index] = null;
      setDrinkIcon(fridgeSlots[index].querySelector(".fridge-slot-item"), "fridge-slot-item", null);
      fridgeSlots[index].classList.remove("filled");
      if (!cupFollowing) pickUpCup();
      updateFridgeSlots();
    }

    function placeOnShelfPot(index) {
      if (!isPotSoup(potContents)) return;
      const slot = fridgeSlots[index];
      fridgeShelves[index] = { ...potContents };
      setSoupIcon(slot.querySelector(".fridge-slot-item"), "fridge-slot-item", potContents);
      slot.classList.add("filled");
      clearPot();
    }

    function takeFromShelfPot(index) {
      const item = fridgeShelves[index];
      if (!item || !canTakeItemFromFridge(item)) return;
      dockCarrierIfOnCounter("pot");
      if (potDirty) {
        potDirty = false;
        pot.classList.remove("dirty");
      }
      setPotSoup({ ...item });
      fridgeShelves[index] = null;
      setSoupIcon(fridgeSlots[index].querySelector(".fridge-slot-item"), "fridge-slot-item", null);
      fridgeSlots[index].classList.remove("filled");
      if (!potFollowing) pickUpPot();
      updateFridgeSlots();
    }

    function placeOnShelfBowl(index) {
      if (!isBowlItem(bowlContents)) return;
      const slot = fridgeSlots[index];
      fridgeShelves[index] = { ...bowlContents };
      setBowlIcon(slot.querySelector(".fridge-slot-item"), "fridge-slot-item", bowlContents);
      slot.classList.add("filled");
      clearBowl();
    }

    function takeFromShelfBowl(index) {
      const item = fridgeShelves[index];
      if (!item || !isBowlItem(item) || !canTakeBowlItemFromFridge()) return;

      dockCarrierIfOnCounter("bowl");

      setBowlItem({ ...item });
      if (!bowlContents) return;

      fridgeShelves[index] = null;
      setBowlIcon(fridgeSlots[index].querySelector(".fridge-slot-item"), "fridge-slot-item", null);
      fridgeSlots[index].classList.remove("filled");

      if (!bowlFollowing) pickUpBowl();
      updateFridgeSlots();
    }

    basket.addEventListener("click", (e) => {
      e.stopPropagation();
      if (basketFollowing) {
        putDownBasket();
      } else {
        pickUpBasket();
      }
    });

    plate.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tryCombineOnCounterCarrier("plate")) return;
      if (trySeasonOnCounterCarrier("plate")) return;
      if (plateRestSpotId || !plateFollowing) {
        pickUpPlate();
      }
    });

    cup.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tryCombineOnCounterCarrier("cup")) return;
      if (trySeasonOnCounterCarrier("cup")) return;
      if (cupRestSpotId || !cupFollowing) {
        pickUpCup();
      }
    });

    pot.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tryCombineOnCounterCarrier("pot")) return;
      if (trySeasonOnCounterCarrier("pot")) return;
      if (potRestSpotId || !potFollowing) {
        pickUpPot();
      }
    });

    bowl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tryCombineOnCounterCarrier("bowl")) return;
      if (trySeasonOnCounterCarrier("bowl")) return;
      if (bowlRestSpotId || !bowlFollowing) {
        pickUpBowl();
      }
    });

    tray.addEventListener("click", (e) => {
      e.stopPropagation();
      if (performance.now() < suppressTrayClickUntil) return;
      if (isTrayCloseupOpen()) return;
      if (isTrayOnCounter()) {
        if (trayActionMenu.classList.contains("open")) {
          hideTrayActionMenu();
        } else {
          showTrayActionMenu();
        }
        return;
      }
      if (!trayFollowing) {
        pickUpTray();
      }
    });

    trayHome.addEventListener("click", (e) => {
      if (e.target.closest("#tray")) return;
      if (trayFollowing) {
        putDownTray();
        return;
      }
      if (isTrayOnHomeDock()) {
        pickUpTray();
      }
    });

    trayMenuPickUp.addEventListener("click", (e) => {
      e.stopPropagation();
      pickUpTray();
    });

    trayMenuPlaceFood.addEventListener("pointerdown", handleTrayPlaceFood, true);
    trayMenuPlaceFood.addEventListener("click", handleTrayPlaceFood, true);

    trayCloseupDone.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTrayCloseup();
    });

    trayCloseup.addEventListener("click", (e) => {
      if (e.target === trayCloseup) {
        closeTrayCloseup();
        return;
      }
      e.stopPropagation();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (isTrayCloseupOpen()) {
        closeTrayCloseup();
        return;
      }
      if (trayActionMenu.classList.contains("open")) {
        hideTrayActionMenu();
        return;
      }
      const book = document.getElementById("recipeBook");
      const bookToggle = document.getElementById("recipeBookToggle");
      if (book && book.classList.contains("open")) {
        book.classList.remove("open");
        if (bookToggle) bookToggle.setAttribute("aria-expanded", "false");
        if (typeof showRecipeList === "function") showRecipeList();
        return;
      }
      if (cashierSequenceBusy) {
        setCashierBusy(false);
      }
    });

    document.addEventListener("click", (e) => {
      if (!trayActionMenu || !trayActionMenu.classList.contains("open")) return;
      if (
        e.target.closest("#trayActionMenu") ||
        e.target.closest("#trayMenuPlaceFood") ||
        e.target.closest("#trayMenuPickUp") ||
        e.target.closest("#tray") ||
        e.target.closest("#trayCloseup")
      ) {
        return;
      }
      hideTrayActionMenu();
    });

    basketHome.addEventListener("click", (e) => {
      if (!basketFollowing) return;
      if (e.target.closest("#basket")) return;
      putDownBasket();
    });

    plateHome.addEventListener("click", (e) => {
      if (!plateFollowing) return;
      if (e.target.closest("#plate")) return;
      putDownPlate();
    });

    cupHome.addEventListener("click", (e) => {
      if (!cupFollowing) return;
      if (e.target.closest("#cup")) return;
      putDownCup();
    });

    potHome.addEventListener("click", (e) => {
      if (!potFollowing) return;
      if (e.target.closest("#pot")) return;
      putDownPot();
    });

    bowlHome.addEventListener("click", (e) => {
      if (!bowlFollowing) return;
      if (e.target.closest("#bowl")) return;
      putDownBowl();
    });

    saltShaker.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isScreen2Active()) return;
      if (saltFollowing) return;
      pickUpSalt();
    });

    pepperShaker.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isScreen2Active()) return;
      if (pepperFollowing) return;
      pickUpPepper();
    });

    saltShakerDock.addEventListener("click", (e) => {
      if (!isScreen2Active() || !saltFollowing) return;
      if (e.target.closest("#saltShaker")) return;
      returnSaltShaker();
    });

    pepperShakerDock.addEventListener("click", (e) => {
      if (!isScreen2Active() || !pepperFollowing) return;
      if (e.target.closest("#pepperShaker")) return;
      returnPepperShaker();
    });

    document.addEventListener("mousemove", (e) => {
      if (basketFollowing) moveBasketWithCursor(e.clientX, e.clientY);
      if (plateFollowing) movePlateWithCursor(e.clientX, e.clientY);
      if (cupFollowing) moveCupWithCursor(e.clientX, e.clientY);
      if (potFollowing) movePotWithCursor(e.clientX, e.clientY);
      if (bowlFollowing) moveBowlWithCursor(e.clientX, e.clientY);
      if (trayFollowing) moveTrayWithCursor(e.clientX, e.clientY);
      if (saltFollowing && isScreen2Active()) moveShakerWithCursor(saltShaker, e.clientX, e.clientY);
      if (pepperFollowing && isScreen2Active()) moveShakerWithCursor(pepperShaker, e.clientX, e.clientY);
    });

    sinkBasin.addEventListener("click", (e) => {
      e.stopPropagation();
      if (kitchenSink.classList.contains("can-drop")) {
        placeInSink();
      } else if (kitchenSink.classList.contains("can-take-plate")) {
        takeFromSink();
      }
    });

    dishwasherZone.addEventListener("click", (e) => {
      e.stopPropagation();
      if (kitchenDishwasher.classList.contains("can-drop-dish")) {
        placeInDishwasher();
      }
    });

    cuttingBoardZone.addEventListener("click", (e) => {
      e.stopPropagation();
      if (kitchenCuttingBoard.classList.contains("can-cut")) {
        placeOnCuttingBoard();
      }
    });

    ovenZone.addEventListener("click", (e) => {
      e.stopPropagation();
      if (kitchenOven.classList.contains("can-drop")) {
        placeInOven();
      } else if (kitchenOven.classList.contains("can-take")) {
        takeFromOven();
      }
    });

    microwaveZone.addEventListener("click", (e) => {
      e.stopPropagation();
      if (kitchenMicrowave.classList.contains("can-drop")) {
        placeInMicrowave();
      } else if (kitchenMicrowave.classList.contains("can-take")) {
        takeFromMicrowave();
      }
    });

    blenderZone.addEventListener("click", (e) => {
      e.stopPropagation();
      if (kitchenBlender.classList.contains("can-drop-food")) {
        placeInBlender();
      } else if (kitchenBlender.classList.contains("can-fill-cup")) {
        takeJuiceFromBlender();
      } else if (kitchenBlender.classList.contains("can-fill-pot")) {
        takeSoupFromBlender();
      } else if (kitchenBlender.classList.contains("can-fill-bowl")) {
        takeFlourFromBlender();
      }
    });

    plants.forEach((plant) => {
      plant.addEventListener("click", (e) => {
        if (!basketFollowing || basketContents) return;
        e.stopPropagation();
        setBasketCrop(plant.dataset.crop);
      });
    });

    coolerDrinks.forEach((drinkEl) => {
      drinkEl.addEventListener("click", (e) => {
        e.stopPropagation();
        if (drinkEl.classList.contains("can-fill")) {
          fillCupFromCooler(drinkEl);
        }
      });
    });

    function handleFridgeShelfClick(index, e) {
      if (!isFridgeShelfInteractive()) return false;
      const slot = fridgeSlots[index];
      const item = fridgeShelves[index];
      if (item && canTakeItemFromFridge(item)) {
        e.stopPropagation();
        const kind = getFridgeItemKind(item);
        if (kind === "basket") takeFromShelf(index);
        else if (kind === "plate") takeFromShelfPlate(index);
        else if (kind === "cup") takeFromShelfCup(index);
        else if (kind === "pot") takeFromShelfPot(index);
        else if (kind === "bowl") takeFromShelfBowl(index);
        return true;
      }
      if (!item && slot.classList.contains("can-drop")) {
        e.stopPropagation();
        if (basketFollowing && basketContents && isBasketFood(basketContents)) {
          placeOnShelf(index);
        } else if (plateFollowing && plateContents && isPlateFood(plateContents)) {
          placeOnShelfPlate(index);
        } else if (cupFollowing && cupContents && isCupDrink(cupContents)) {
          placeOnShelfCup(index);
        } else if (potFollowing && potContents && isPotSoup(potContents)) {
          placeOnShelfPot(index);
        } else if (bowlFollowing && bowlContents && isBowlItem(bowlContents)) {
          placeOnShelfBowl(index);
        }
        return true;
      }
      return false;
    }

    fridgeSlots.forEach((slot) => {
      slot.addEventListener("click", (e) => {
        if (handleFridgeShelfClick(Number(slot.dataset.shelf), e)) return;
        if (!kitchenFridge.classList.contains("open")) return;
        if (
          kitchenFridge.classList.contains("opening") ||
          kitchenFridge.classList.contains("closing")
        ) {
          return;
        }
        e.stopPropagation();
        toggleFridge();
      });
    });

    kitchenTrashCans.forEach((trash) => {
      trash.addEventListener("click", (e) => {
        e.stopPropagation();
        throwAwayFood(trash);
      });
    });

    document.querySelectorAll(".counter-rest-spot").forEach((spot) => {
      spot.addEventListener("click", (e) => {
        e.stopPropagation();
        if (trySeasonCounterSpot(spot)) return;
        if (spot.classList.contains("can-combine") || spot.classList.contains("can-place")) {
          tryPlaceOnCounterSpot(spot);
        }
      });
    });

    window.addEventListener("resize", () => {
      updateCounterRestSpots();
    });

    releaseStuckUI();
    updateCarrierUI();
    window.addEventListener("pageshow", releaseStuckUI);

    kitchenFridge.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target.closest(".fridge-slot")) return;
      if (kitchenFridge.classList.contains("opening") || kitchenFridge.classList.contains("closing")) {
        return;
      }
      toggleFridge();
    });

    kitchenFridge.addEventListener("keydown", (e) => {
      if (e.target.closest(".fridge-slot")) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (kitchenFridge.classList.contains("opening") || kitchenFridge.classList.contains("closing")) {
          return;
        }
        toggleFridge();
      }
    });

    function bindApplianceToggle(el, labels, clickIgnore) {
      function isAnimating() {
        return el.classList.contains("opening") || el.classList.contains("closing");
      }

      function toggle() {
        if (isAnimating()) return;
        if (el.classList.contains("open")) {
          el.classList.add("closing");
          el.classList.remove("open");
          el.setAttribute("aria-label", labels.closed);
          setTimeout(() => el.classList.remove("closing"), APPLIANCE_ANIM_MS);
        } else {
          el.classList.add("opening", "open");
          el.setAttribute("aria-label", labels.open);
          setTimeout(() => el.classList.remove("opening"), APPLIANCE_ANIM_MS);
        }
        updateCarrierUI();
      }

      function closeInstant() {
        if (
          !el.classList.contains("open") &&
          !el.classList.contains("opening") &&
          !el.classList.contains("closing")
        ) {
          return;
        }
        el.classList.remove("open", "opening", "closing");
        el.setAttribute("aria-label", labels.closed);
        updateCarrierUI();
      }

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (clickIgnore && e.target.closest(clickIgnore)) return;
        toggle();
      });

      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });

      applianceCloseFns.push(closeInstant);
    }

    bindApplianceToggle(kitchenDishwasher, {
      closed: "Open dishwasher",
      open: "Close dishwasher",
    }, ".dishwasher-zone");
    bindApplianceToggle(kitchenMicrowave, {
      closed: "Open microwave",
      open: "Close microwave",
    }, ".microwave-zone");
    bindApplianceToggle(kitchenCooler, {
      closed: "Open cooler",
      open: "Close cooler",
    }, ".cooler-drink.can-fill");
    bindApplianceToggle(kitchenOven, {
      closed: "Open oven",
      open: "Close oven",
    }, ".oven-zone");

    function closeAllAppliancesInstant() {
      closeFridgeInstant();
      clearDishwasherInstant();
      clearBlenderInstant();
      clearCuttingInstant();
      clearOvenInstant();
      clearMicrowaveInstant();
      applianceCloseFns.forEach((close) => close());
    }

    function closeFridgeInstant() {
      if (
        !kitchenFridge.classList.contains("open") &&
        !kitchenFridge.classList.contains("opening") &&
        !kitchenFridge.classList.contains("closing")
      ) {
        return;
      }
      kitchenFridge.classList.remove("open", "opening", "closing");
      kitchenFridge.setAttribute("aria-label", "Open refrigerator");
      updateFridgeSlots();
    }

    function toggleFridge() {
      if (kitchenFridge.classList.contains("open")) {
        kitchenFridge.classList.add("closing");
        kitchenFridge.classList.remove("open");
        updateFridgeSlots();
        kitchenFridge.setAttribute("aria-label", "Open refrigerator");
        setTimeout(() => {
          kitchenFridge.classList.remove("closing");
        }, FRIDGE_ANIM_MS);
      } else {
        kitchenFridge.classList.add("opening", "open");
        updateFridgeSlots();
        kitchenFridge.setAttribute("aria-label", "Close refrigerator");
        setTimeout(() => {
          kitchenFridge.classList.remove("opening");
        }, FRIDGE_ANIM_MS);
      }
    }

    function navigateToScreen(num) {
      const active = document.querySelector(".screen.active");
      if (active && Number(active.dataset.screen) !== num) {
        closeAllAppliancesInstant();
        releaseStuckUI();
      }
      showScreen(num);
      if (num === 5) {
        ensureCashierCustomer();
      }
      updateCarrierUI();
    }

    document.querySelectorAll(".nav-arrow[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigateToScreen(Number(btn.dataset.go));
      });
    });

    if (cashierTraySpot) {
      cashierTraySpot.addEventListener("click", (e) => {
        e.stopPropagation();
        handleCashierTraySpotClick();
      });
    }

    const recipeBook = document.getElementById("recipeBook");
    const recipeBookToggle = document.getElementById("recipeBookToggle");
    const recipeList = document.getElementById("recipeList");
    const recipeDetail = document.getElementById("recipeDetail");
    const recipeDetailTitle = document.getElementById("recipeDetailTitle");
    const recipeDetailSteps = document.getElementById("recipeDetailSteps");
    const recipeBack = document.getElementById("recipeBack");

    function showRecipeList() {
      recipeBook.classList.remove("show-detail");
    }

    function showRecipeDetail(recipe) {
      recipeDetailTitle.textContent = recipe.name;
      recipeDetailSteps.textContent = recipe.steps;
      recipeBook.classList.add("show-detail");
    }

    RECIPE_BOOK.forEach((recipe) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "recipe-list-item";
      btn.textContent = recipe.name;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        showRecipeDetail(recipe);
      });
      recipeList.appendChild(btn);
    });

    recipeBookToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = recipeBook.classList.toggle("open");
      recipeBookToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) showRecipeList();
    });

    recipeBack.addEventListener("click", (e) => {
      e.stopPropagation();
      showRecipeList();
    });

    recipeBook.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !recipeBook.classList.contains("open")) return;
      recipeBook.classList.remove("open");
      recipeBookToggle.setAttribute("aria-expanded", "false");
      showRecipeList();
    });
  