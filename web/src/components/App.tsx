// Copyright (c) 2018-2019 Coinbase, Inc. <https://coinbase.com/>
// Licensed under the Apache License, version 2.0

import { createHashHistory } from "history"
import React from "react"
import { Route, Router } from "react-router-dom"
import { SERVER_URL, WEB_URL } from "../config"
import { isLocalStorageBlocked, postMessageToParent } from "../lib/util"
import { MainRepository } from "../repositories/MainRepository"
import { routes } from "../routes"
import { LocalStorageBlockedMessage } from "../WalletLink/types/LocalStorageBlockedMessage"
import { AppContext } from "./AppContext"
import { LinkRoute } from "./Link/LinkRoute"
import { LinkedRoute } from "./Linked/LinkedRoute"
import { ResetRoute } from "./Reset/ResetRoute"
import { RootRoute } from "./Root/RootRoute"

export class App extends React.PureComponent {
  private readonly history = createHashHistory()

  private mainRepo: MainRepository | null = null

  constructor(props: {}) {
    super(props)

    if (isLocalStorageBlocked()) {
      postMessageToParent(LocalStorageBlockedMessage())
    } else {
      this.mainRepo = new MainRepository({
        serverUrl: SERVER_URL,
        webUrl: WEB_URL
      })
    }
  }

  public render() {
    const { mainRepo } = this
    return (
      <Router history={this.history}>
        <Route exact path={routes.root} component={RootRoute} />

        {mainRepo && (
          <AppContext.Provider value={{ mainRepo }}>
            <Route exact path={routes.link} component={LinkRoute} />
            <Route exact path={routes.linked} component={LinkedRoute} />
            <Route exact path={routes.reset} component={ResetRoute} />
          </AppContext.Provider>
        )}
      </Router>
    )
  }
}
