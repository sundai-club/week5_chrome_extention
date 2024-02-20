class Filter {
    constructor(name, image, funcName, args) {
        this.name = name;
        this.image = image;
        this.funcName = funcName;
        this.args = args;
    }
}

const filterGrid = [
    new Filter('th 1', 'mask1.png', 'threshold', {"threshold": [100, 100, 100]}),
    new Filter('th 2', 'mask1.png', 'threshold', {"threshold": [150, 150, 150]}),
    new Filter('th 3', 'mask1.png', 'threshold', {"threshold": [200, 200, 200]}),
    new Filter('th 4', 'mask1.png', 'threshold', {"threshold": [250, 250, 250]}),
    new Filter('th 5', 'mask1.png', 'threshold', {"threshold": [30, 30, 30]}),
    new Filter('th 6', 'mask1.png', 'threshold', {"threshold": [60, 60, 60]}),
    new Filter('th 7', 'mask1.png', 'threshold', {"threshold": [90, 90, 90]}),
    new Filter('th 8', 'mask1.png', 'threshold', {"threshold": [120, 120, 120]}),
    new Filter('th 9', 'mask1.png', 'threshold', {"threshold": [180, 180, 180]}),
]
