1. **`basic/toolbars_and_menus_1.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction
from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QToolBar,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        self.addToolBar(toolbar)

    def onMyToolBarButtonClick(self: Self, s: str) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/toolbars_and_menus_2.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction
from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QToolBar,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        self.addToolBar(toolbar)

        button_action = QAction("Your button", self)
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)

        toolbar.addAction(button_action)

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/toolbars_and_menus_3.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction
from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        self.addToolBar(toolbar)

        button_action = QAction("Your button", self)
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)
        toolbar.addAction(button_action)

        self.setStatusBar(QStatusBar(self))

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/toolbars_and_menus_4.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction
from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        self.addToolBar(toolbar)

        button_action = QAction("Your button", self)
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)
        button_action.setCheckable(True)
        toolbar.addAction(button_action)

        self.setStatusBar(QStatusBar(self))

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/toolbars_and_menus_5.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction, QIcon
from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QWidget,
)

CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        self.addToolBar(toolbar)

        button_action = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "Your button",
            self,
        )
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)
        button_action.setCheckable(True)
        toolbar.addAction(button_action)

        self.setStatusBar(QStatusBar(self))

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/toolbars_and_menus_6.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction, QIcon
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QLabel,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QWidget,
)

CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        self.addToolBar(toolbar)

        button_action = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "Your button",
            self,
        )
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)
        button_action.setCheckable(True)
        toolbar.addAction(button_action)

        toolbar.addSeparator()
        button_action2 = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "Your button2",
            self,
        )
        button_action2.setStatusTip("This is your button2")
        button_action2.triggered.connect(self.onMyToolBarButtonClick)
        button_action2.setCheckable(True)

        toolbar.addAction(button_action2)
        toolbar.addWidget(QLabel("Hello"))
        toolbar.addWidget(QCheckBox())

        self.setStatusBar(QStatusBar(self))

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/toolbars_and_menus_7.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import QSize, Qt
from PySide6.QtGui import QAction, QIcon
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QLabel,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QWidget,
)

CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        toolbar.setIconSize(QSize(16, 16))
        self.addToolBar(toolbar)

        button_action = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "&Your button",
            self,
        )
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)
        button_action.setCheckable(True)
        toolbar.addAction(button_action)

        toolbar.addSeparator()

        button_action2 = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "Your button2",
            self,
        )
        button_action2.setStatusTip("This is your button2")
        button_action2.triggered.connect(self.onMyToolBarButtonClick)
        button_action2.setCheckable(True)

        toolbar.addAction(button_action2)
        toolbar.addWidget(QLabel("Hello"))
        toolbar.addWidget(QCheckBox())

        self.setStatusBar(QStatusBar(self))

        menu = self.menuBar()
        file_menu = menu.addMenu("&File")
        file_menu.addAction(button_action)

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/toolbars_and_menus_8.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import QSize, Qt
from PySide6.QtGui import QAction, QIcon
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QLabel,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QWidget,
)

CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        toolbar.setIconSize(QSize(16, 16))
        self.addToolBar(toolbar)

        button_action = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "&Your button",
            self,
        )
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)
        button_action.setCheckable(True)
        toolbar.addAction(button_action)

        toolbar.addSeparator()

        button_action2 = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "Your button2",
            self,
        )
        button_action2.setStatusTip("This is your button2")
        button_action2.triggered.connect(self.onMyToolBarButtonClick)
        button_action2.setCheckable(True)

        toolbar.addAction(button_action2)
        toolbar.addWidget(QLabel("Hello"))
        toolbar.addWidget(QCheckBox())

        self.setStatusBar(QStatusBar(self))

        menu = self.menuBar()
        file_menu = menu.addMenu("&File")
        file_menu.addAction(button_action)
        file_menu.addSeparator()
        file_menu.addAction(button_action2)

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/toolbars_and_menus_9.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import QSize, Qt
from PySide6.QtGui import QAction, QIcon
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QLabel,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QWidget,
)

CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        toolbar.setIconSize(QSize(16, 16))
        self.addToolBar(toolbar)

        button_action = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "&Your button",
            self,
        )
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)
        button_action.setCheckable(True)
        toolbar.addAction(button_action)

        toolbar.addSeparator()

        button_action2 = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "Your button2",
            self,
        )
        button_action2.setStatusTip("This is your button2")
        button_action2.triggered.connect(self.onMyToolBarButtonClick)
        button_action2.setCheckable(True)

        toolbar.addAction(button_action2)
        toolbar.addWidget(QLabel("Hello"))
        toolbar.addWidget(QCheckBox())

        self.setStatusBar(QStatusBar(self))

        menu = self.menuBar()
        file_menu = menu.addMenu("&File")
        file_menu.addAction(button_action)
        file_menu.addSeparator()

        file_submenu = file_menu.addMenu("Submenu")
        file_submenu.addAction(button_action2)

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```


1. **`basic/toolbars_and_menus_end.py`**

```python
from __future__ import annotations

import sys
from pathlib import Path
from typing import Self

from PySide6.QtCore import QSize, Qt
from PySide6.QtGui import QAction, QIcon, QKeySequence
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QLabel,
    QMainWindow,
    QStatusBar,
    QToolBar,
    QWidget,
)

CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        label = QLabel("Hello")
        label.setAlignment(Qt.AlignCenter)

        self.setCentralWidget(label)

        toolbar = QToolBar("My main toolbar")
        toolbar.setIconSize(QSize(16, 16))
        self.addToolBar(toolbar)

        button_action = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "&Your button",
            self,
        )
        button_action.setStatusTip("This is your button")
        button_action.triggered.connect(self.onMyToolBarButtonClick)
        button_action.setCheckable(True)
        button_action.setShortcut(QKeySequence("Ctrl+p"))

        toolbar.addAction(button_action)

        toolbar.addSeparator()

        button_action2 = QAction(
            QIcon(str(CURRENT_PATH / "folder-icon.png")),
            "Your button2",
            self,
        )
        button_action2.setStatusTip("This is your button2")
        button_action2.triggered.connect(self.onMyToolBarButtonClick)
        button_action2.setCheckable(True)

        toolbar.addAction(button_action2)
        toolbar.addWidget(QLabel("Hello"))
        toolbar.addWidget(QCheckBox())

        self.setStatusBar(QStatusBar(self))

        menu = self.menuBar()
        file_menu = menu.addMenu("&File")
        file_menu.addAction(button_action)
        file_menu.addSeparator()

        file_submenu = file_menu.addMenu("Submenu")
        file_submenu.addAction(button_action2)

    def onMyToolBarButtonClick(self: Self, s: bool) -> None:
        print("click", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```