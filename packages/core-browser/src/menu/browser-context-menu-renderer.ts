/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { Injectable, Autowired } from '@ali/common-di';
import { MenuPath } from '@ali/ide-core-common';
import { ContextMenuRenderer, Anchor } from './context-menu-renderer';
import { BrowserMainMenuFactory } from './browser-menu-plugin';

@Injectable()
export class BrowserContextMenuRenderer implements ContextMenuRenderer {

    @Autowired(BrowserMainMenuFactory)
    private menuFactory: BrowserMainMenuFactory;

    render(menuPath: MenuPath, anchor: Anchor, onHide?: () => void): void {
      const contextMenu = this.menuFactory.createContextMenu(menuPath, anchor);
      const { x, y } = anchor instanceof MouseEvent ? { x: anchor.clientX, y: anchor.clientY } : anchor;
      if (onHide) {
          contextMenu.aboutToClose.connect(() => onHide());
      }
      contextMenu.open(x, y);
    }

}
