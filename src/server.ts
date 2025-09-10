// server.ts
import { HttpMiddleware, HttpRouter } from "@effect/platform"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { RpcSerialization, RpcServer } from "@effect/rpc"
import { Layer } from "effect"
import { UsersLive } from "./handlers"
import { UserRpcs } from "./request"

// Create the RPC server layer
const RpcLayer = RpcServer.layer(UserRpcs).pipe(Layer.provide(UsersLive))

// Choose the protocol and serialization format
const HttpProtocol = RpcServer.layerProtocolHttp({
  path: "/rpc"
}).pipe(Layer.provide(RpcSerialization.layerNdjson))

// Create the main server layer
const Main = HttpRouter.Default.serve(HttpMiddleware.logger).pipe(
  Layer.provide(RpcLayer),
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 3002 }))
)

BunRuntime.runMain(Layer.launch(Main))